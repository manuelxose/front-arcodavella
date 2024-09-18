import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationI } from 'src/app/core/models/notification.model';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { NgIf, NgClass } from '@angular/common';
import { NotificationDetailComponent } from '../../components/notificaciones/notification-detail/notification-detail.component';
import { NotificationListComponent } from '../../components/notificaciones/notification-list/notification-list.component';
import { NotificationSidebarComponent } from '../../components/notificaciones/notification-sidebar/notification-sidebar.component';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
  standalone: true,
  imports: [NgIf, NotificationSidebarComponent, NotificationDetailComponent, NotificationListComponent, NgClass],
})
export class NotificacionesComponent implements OnInit {
  notifications: NotificationI[] = [];
  filteredNotifications: NotificationI[] = [];
  selectedNotification: NotificationI | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // Cargar notificaciones desde el servicio
    this.notificationService.loadNotifications();

    // Suscribirse a las notificaciones
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      this.applyCurrentFilter(); // Aplicar el filtro actual cada vez que las notificaciones cambien
      console.log(this.notifications);
    });
  }

  // Getters para los conteos de notificaciones
  get totalNotifications(): number {
    return this.notifications.length;
  }

  get pendingNotifications(): number {
    return this.notifications.filter((n) => n.status === StatusCodes.UNREAD).length;
  }

  get readNotifications(): number {
    return this.notifications.filter((n) => n.status === StatusCodes.READ).length;
  }

  get acceptedNotifications(): number {
    // Añadir este getter
    return this.notifications.filter((n) => n.status === StatusCodes.APPROVED).length;
  }

  // Variable para mantener el filtro actual
  currentFilter: 'all' | 'unread' | 'approved' | 'read' = 'all';

  // Método para seleccionar el filtro
  filterNotifications(status: 'all' | 'unread' | 'approved' | 'read'): void {
    this.currentFilter = status;
    this.applyCurrentFilter();
  }

  // Método para aplicar el filtro actual
  applyCurrentFilter(): void {
    let mappedStatus: StatusCodes | 'all';

    switch (this.currentFilter) {
      case 'all':
        mappedStatus = 'all';
        break;
      case 'unread':
        mappedStatus = StatusCodes.UNREAD;
        break;
      case 'read':
        mappedStatus = StatusCodes.READ;
        break;
      case 'approved':
        mappedStatus = StatusCodes.APPROVED;
        break;
      default:
        mappedStatus = 'all';
    }

    this.filteredNotifications = this.notificationService.filterNotificationsByStatus(mappedStatus);
  }

  // Métodos para seleccionar y manejar notificaciones
  selectNotification(notification: NotificationI): void {
    this.selectedNotification = notification;
    if (notification.status === StatusCodes.UNREAD) {
      this.markAsRead(notification);
    }
  }

  clearSelection(): void {
    this.selectedNotification = null;
  }

  markAsRead(notification: NotificationI): void {
    if (notification.id) this.notificationService.updateNotificationStatus(notification.id, StatusCodes.READ);
  }

  markAsUnread(notification: NotificationI): void {
    if (notification.id) this.notificationService.updateNotificationStatus(notification.id, StatusCodes.UNREAD);
  }

  // Método para buscar notificaciones
  searchNotifications(query: string): void {
    this.filteredNotifications = this.notifications.filter(
      (notification) =>
        notification.message.toLowerCase().includes(query.toLowerCase()) ||
        notification.recipientId.toLowerCase().includes(query.toLowerCase()),
    );
  }

  // Método para aceptar una solicitud
  onAcceptRequest(notification: NotificationI): void {
    console.log('Aceptando notificacion: ', notification);
    if (notification.id) {
      this.notificationService.acceptRequest(notification.id);
    }
  }
}
