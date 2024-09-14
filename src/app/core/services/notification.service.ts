import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NotificationI } from 'src/app/core/models/notification.model';
import { environment } from 'src/environments/environment';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { NotificationTypes } from '../enums/notification.enums';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}`;

  // BehaviorSubject para mantener las notificaciones
  private notificationsSubject = new BehaviorSubject<NotificationI[]>([]);
  notifications$: Observable<NotificationI[]> = this.notificationsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  // Cargar notificaciones desde el servidor
  loadNotifications(): void {
    this.http
      .get<{ notifications: NotificationI[] }>(`${this.apiUrl}/notification/all`, { withCredentials: true })
      .subscribe((response) => this.notificationsSubject.next(response.notifications));
  }

  // Obtener el array actual de notificaciones
  getNotifications(): NotificationI[] {
    return this.notificationsSubject.getValue();
  }

  // Actualizar el estado de una notificación tanto localmente como en el servidor
  updateNotificationStatus(notificationId: string, status: StatusCodes): void {
    this.updateNotificationState(notificationId, status);
    this.sendNotificationUpdateToServer(notificationId, status);
  }

  // Filtrar las notificaciones por estado
  filterNotificationsByStatus(status: StatusCodes | 'all'): NotificationI[] {
    const notifications = this.getNotifications();
    return status === 'all' ? notifications : notifications.filter((notification) => notification.status === status);
  }

  // Aceptar solicitud del usuario (user_request o update_profile)
  acceptRequest(notificationId: string): void {
    const notification = this.getNotificationById(notificationId);
    if (!notification) return;

    if (notification.type === NotificationTypes.USER_REQUEST) {
      this.handleUserRequest(notificationId, notification.recipientId);
    } else if (notification.type === NotificationTypes.UPDATE_PROFILE) {
      this.handleProfileUpdate(
        notificationId,
        notification.recipientId,
        notification.fieldToUpdate,
        notification.newValue,
      );
    }
  }

  // Crear una nueva notificación en el servidor
  createNotification(data: NotificationI): void {
    console.log('Datos a enviar creando la notificacion: ', data);
    this.http.post(`${this.apiUrl}/notification`, { data }, { withCredentials: true }).subscribe(
      (response) => console.log('Notification sent successfully:', response),
      (error) => console.error('Error sending notification:', error),
    );
  }

  // Método privado para actualizar el estado de la notificación localmente
  private updateNotificationState(notificationId: string, status: StatusCodes): void {
    const updatedNotifications = this.getNotifications().map((notification) =>
      notification.id === notificationId ? { ...notification, status } : notification,
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  // Método privado para enviar la actualización de la notificación al servidor
  private sendNotificationUpdateToServer(notificationId: string, status: StatusCodes): void {
    this.http
      .put(`${this.apiUrl}/notification/${notificationId}`, { status }, { withCredentials: true })
      .subscribe(() => console.log(`Notification ${notificationId} status updated to ${status} on server`));
  }

  // Método privado para manejar la aceptación de una solicitud de usuario
  private handleUserRequest(notificationId: string, recipientId: string): void {
    this.updateUserStatus(recipientId, StatusCodes.ACTIVE).subscribe(() => {
      this.updateNotificationStatus(notificationId, StatusCodes.APPROVED);
    });
  }

  // Método privado para manejar la actualización de perfil
  private handleProfileUpdate(
    notificationId: string,
    recipientId: string,
    fieldToUpdate?: string,
    newValue?: any,
  ): void {
    console.log('llega aqui');

    if (!fieldToUpdate || newValue === undefined) return;
    this.updateUserProfile(recipientId, fieldToUpdate, newValue).subscribe(() => {
      this.updateNotificationStatus(notificationId, StatusCodes.APPROVED);
    });
  }

  // Método privado para obtener una notificación por ID
  private getNotificationById(notificationId: string): NotificationI | undefined {
    return this.getNotifications().find((notif) => notif.id === notificationId);
  }

  // Método privado para actualizar el estado de un usuario
  private updateUserStatus(recipientId: string, status: StatusCodes): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/${recipientId}`, { status }, { withCredentials: true });
  }

  // Método privado para actualizar el perfil del usuario
  private updateUserProfile(recipientId: string, fieldToUpdate: string, newValue: any): Observable<any> {
    console.log('Envio de modificacion de usuario');

    return this.http.put(
      `${this.apiUrl}/auth/${recipientId}`,
      { [fieldToUpdate]: newValue },
      { withCredentials: true },
    );
  }
}
