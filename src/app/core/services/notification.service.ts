import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationI } from 'src/app/core/models/notification.model';
import { environment } from 'src/environments/environment';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { NotificationTypes } from '../enums/notification.enums';
import { catchError } from 'rxjs/operators';
import { SendBulkEmailDTO, SendEmailDTO } from '../models/email.model';
import pako from 'pako';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}`;

  // BehaviorSubject para gestionar el estado de las notificaciones
  private notificationsSubject = new BehaviorSubject<NotificationI[]>([]);
  notifications$: Observable<NotificationI[]> = this.notificationsSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  // Cargar notificaciones desde el servidor
  loadNotifications(): void {
    this.http
      .get<{ notifications: NotificationI[] }>(`${this.apiUrl}/notification/all`, { withCredentials: true })
      .pipe(
        catchError(this.handleError<{ notifications: NotificationI[] }>('loadNotifications', { notifications: [] })),
      )
      .subscribe(
        (response) => {
          if (response && response.notifications) {
            this.notificationsSubject.next(response.notifications);
          } else {
            this.notificationsSubject.next([]); // Manejar caso donde las notificaciones puedan no existir
          }
        },
        (error) => {
          console.error('Error loading notifications:', error);
          this.notificationsSubject.next([]); // Manejar caso de error con un array vacío
        },
      );
  }

  // Obtener el array actual de notificaciones
  getNotifications(): NotificationI[] {
    return this.notificationsSubject.getValue();
  }

  // Actualizar el estado de una notificación localmente y en el servidor
  updateNotificationStatus(notificationId: string, status: StatusCodes): Observable<any> {
    this.updateNotificationState(notificationId, status);
    return this.sendNotificationUpdateToServer(notificationId, status);
  }

  // Filtrar notificaciones por estado
  filterNotificationsByStatus(status: StatusCodes | 'all'): NotificationI[] {
    const notifications = this.getNotifications();
    return status === 'all' ? notifications : notifications.filter((notification) => notification.status === status);
  }

  // Aceptar una solicitud basada en el tipo de notificación
  acceptRequest(notificationId: string): Observable<any> {
    const notification = this.getNotificationById(notificationId);
    if (!notification) return throwError(() => new Error('Notificación no encontrada'));

    switch (notification.type) {
      case NotificationTypes.USER_REQUEST:
        return this.handleUserRequest(notificationId, notification.recipientId);
      case NotificationTypes.UPDATE_PROFILE:
        return this.handleProfileUpdate(
          notificationId,
          notification.recipientId,
          notification.fieldToUpdate,
          notification.newValue,
        );
      default:
        console.warn('Unknown notification type');
        return throwError(() => new Error('Tipo de notificación desconocido'));
    }
  }

  // Crear una nueva notificación en el servidor
  createNotification(data: NotificationI): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/notification`, { data }, { withCredentials: true })
      .pipe(catchError(this.handleError('createNotification')));
  }

  // Actualizar estado de notificación localmente
  private updateNotificationState(notificationId: string, status: StatusCodes): void {
    const updatedNotifications = this.getNotifications().map((notification) =>
      notification.id === notificationId ? { ...notification, status } : notification,
    );
    this.notificationsSubject.next(updatedNotifications);
  }

  // Enviar actualización de notificación al servidor
  private sendNotificationUpdateToServer(notificationId: string, status: StatusCodes): Observable<any> {
    return this.http.put(`${this.apiUrl}/notification/${notificationId}`, { status }, { withCredentials: true }).pipe(
      catchError(this.handleError('sendNotificationUpdateToServer')),
      // Opcional: Puedes agregar tap para loguear el éxito
    );
  }

  // Manejar la aceptación de una solicitud de usuario
  private handleUserRequest(notificationId: string, recipientId: string): Observable<any> {
    return this.updateUserStatus(recipientId, StatusCodes.ACTIVE).pipe(
      catchError(this.handleError('handleUserRequest')),
      // En el pipe, puedes agregar más operadores si es necesario
    );
  }

  // Manejar la aceptación de una actualización de perfil
  private handleProfileUpdate(
    notificationId: string,
    recipientId: string,
    fieldToUpdate?: string,
    newValue?: any,
  ): Observable<any> {
    if (!fieldToUpdate || newValue === undefined) {
      return throwError(() => new Error('Campo a actualizar o nuevo valor no proporcionado'));
    }

    return this.updateUserProfile(recipientId, fieldToUpdate, newValue).pipe(
      catchError(this.handleError('handleProfileUpdate')),
      // En el pipe, puedes agregar más operadores si es necesario
    );
  }

  // Obtener una notificación por ID
  private getNotificationById(notificationId: string): NotificationI | undefined {
    return this.getNotifications().find((notif) => notif.id === notificationId);
  }

  // Actualizar el estado del usuario
  private updateUserStatus(recipientId: string, status: StatusCodes): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/auth/${recipientId}`, { status }, { withCredentials: true })
      .pipe(catchError(this.handleError('updateUserStatus')));
  }

  // Actualizar el perfil del usuario
  private updateUserProfile(recipientId: string, fieldToUpdate: string, newValue: any): Observable<any> {
    return this.http
      .put(`${this.apiUrl}/auth/${recipientId}`, { [fieldToUpdate]: newValue }, { withCredentials: true })
      .pipe(catchError(this.handleError('updateUserProfile')));
  }

  // Obtener todos los usuarios
  getAllUsers(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/auth/all`, { withCredentials: true })
      .pipe(catchError(this.handleError('getAllUsers')));
  }

  // Obtener todos los miembros
  getAllMembers(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/member/all`, { withCredentials: true })
      .pipe(catchError(this.handleError('getAllMembers')));
  }

  // --- Métodos para Envío de Correos Electrónicos ---

  /**
   * Enviar un correo electrónico individual.
   * @param data Datos del correo a enviar.
   * @returns Observable con la respuesta de la API.
   */
  enviarNotificacion(data: SendEmailDTO): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post(`${this.apiUrl}/notifications/send`, data, { headers })
      .pipe(catchError(this.handleError('enviarNotificacion')));
  }

  /**
   * Enviar correos electrónicos de forma masiva.
   * @param data Datos de los correos a enviar en bloque.
   * @returns Observable con la respuesta de la API.
   */
  enviarNotificacionMasiva(data: SendBulkEmailDTO): Observable<any> {
    // Comprimir los datos usando Gzip
    const compressedData = pako.gzip(JSON.stringify(data));

    // Convertir el Uint8Array a un Blob
    const blob = new Blob([compressedData], { type: 'application/octet-stream' });

    const headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream', // Indicador de contenido binario
      'Content-Encoding': 'gzip', // Señaliza que está comprimido
    });

    return this.http
      .post(`${this.apiUrl}/notification/send-bulk`, blob, {
        headers,
        responseType: 'json', // Asegura que la respuesta se maneje como JSON
      })
      .pipe(catchError(this.handleError('enviarNotificacionMasiva')));
  }
  // --- Fin de Métodos para Envío de Correos Electrónicos ---

  // Método privado para manejar errores de HttpClient
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`); // Loguear en la consola

      // Puedes personalizar el manejo de errores aquí
      // Por ejemplo, podrías enviar el error a un servicio de logging

      // Retornar un observable con un valor predeterminado para continuar la aplicación
      return of(result as T);
    };
  }
}
