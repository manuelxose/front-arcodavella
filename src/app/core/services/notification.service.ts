import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationI } from 'src/app/core/models/notification.model';
import { environment } from 'src/environments/environment';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { NotificationTypes } from '../enums/notification.enums';
import { catchError, tap } from 'rxjs/operators';
import { SendBulkEmailDTO, SendEmailDTO } from '../models/email.model';
import pako from 'pako';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { TemplateService } from './template.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}`;

  // BehaviorSubject para gestionar el estado de las notificaciones
  private notificationsSubject = new BehaviorSubject<NotificationI[]>([]);
  notifications$: Observable<NotificationI[]> = this.notificationsSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly templateService: TemplateService,
  ) {}

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

  /**
   * Aceptar una solicitud basada en el tipo de notificación.
   * @param notificationId ID de la notificación.
   */
  acceptRequest(notificationId: string): void {
    const notification = this.getNotificationById(notificationId);
    if (!notification) {
      console.warn(`Notification with ID ${notificationId} not found`);
      return;
    }

    switch (notification.type) {
      case NotificationTypes.USER_REQUEST:
        this.handleUserRequest(notificationId, notification.recipientId);
        break;
      case NotificationTypes.UPDATE_PROFILE:
        this.handleProfileUpdate(
          notificationId,
          notification.recipientId,
          notification.fieldToUpdate,
          notification.newValue,
        );
        break;
      default:
        console.warn('Unknown notification type:', notification.type);
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
  private handleUserRequest(notificationId: string, recipientId: string): void {
    this.updateUserStatus(recipientId, StatusCodes.ACTIVE).subscribe({
      next: () => {
        // Only if the user status update succeeds, we update the notification
        this.updateNotificationStatus(notificationId, StatusCodes.APPROVED);
      },
      error: (error) => {
        // Log the error and do not update the notification status
        console.error('Error updating user status:', error);
      },
    });
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

  /**
   * Actualizar el estado de un usuario.
   * @param recipientId ID del usuario.
   * @param status Nuevo estado del usuario.
   * @returns Observable de la respuesta.
   */
  private updateUserStatus(recipientId: string, status: StatusCodes): Observable<any> {
    console.log('updateUserStatus');
    return this.http.put(`${this.apiUrl}/auth/${recipientId}`, { status }, { withCredentials: true }).pipe(
      tap(() => {
        if (status === StatusCodes.ACTIVE) {
          this.sendWelcomeEmail(recipientId); // Enviar el correo de bienvenida
        }
      }),
      catchError(this.handleError('updateUserStatus')),
    );
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
      .post(`${this.apiUrl}/email/send`, data, { headers, withCredentials: true })
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

  /**
   * Enviar un correo de bienvenida a un usuario recién activado.
   * @param recipientId ID del usuario al que se le enviará el correo.
   */
  private sendWelcomeEmail(recipientId: string): void {
    // Inicializamos un nuevo objeto Member
    const user: User = {} as User;

    user.id = recipientId;

    // Llamamos al servicio con el objeto Member
    this.userService.getUserProfile(user).subscribe({
      next: (response: User) => {
        const email = response.email; // Obtener el correo desde el perfil

        const emailData: SendEmailDTO = {
          to: email,
          subject: 'Bienvenido a nuestra plataforma',
          bodyText: this.templateService.getWelcomeTemplate(), // Usa la plantilla de bienvenida
          bodyHtml: this.templateService.getWelcomeTemplate(), // Usa la plantilla de bienvenida
        };

        // Enviar el correo de bienvenida
        this.enviarNotificacion(emailData).subscribe({
          next: () => console.log('Correo de bienvenida enviado a:', email),
          error: (err) => console.error('Error al enviar correo de bienvenida:', err),
        });
      },
      error: (err) => {
        console.error('Error al obtener el correo del usuario:', err);
      },
    });
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
