import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationTypes } from 'src/app/core/enums/notification.enums';
import { NotificationI } from 'src/app/core/models/notification.model';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  standalone: true,
  imports: [NgIf, CommonModule],
})
export class NotificationDetailComponent {
  @Input() notification!: NotificationI;
  @Output() close = new EventEmitter<void>();
  @Output() markAsUnread = new EventEmitter<NotificationI>(); // Evento para marcar como no leído
  @Output() acceptRequest = new EventEmitter<NotificationI>(); // Nuevo evento para aceptar solicitud

  onAcceptRequest(): void {
    this.acceptRequest.emit(this.notification); // Emite el evento para aceptar la solicitud
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  onMarkAsUnread(): void {
    this.markAsUnread.emit(this.notification); // Emite el evento para marcar como no leído
    this.close.emit();
  }
  isUserRequest(): boolean {
    return (
      this.notification.type === NotificationTypes.USER_REQUEST ||
      this.notification.type === NotificationTypes.UPDATE_PROFILE
    );
  }
}
