import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationI } from 'src/app/core/models/notification.model';

@Component({
  standalone: true,

  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  imports: [NgFor, NgIf, CommonModule],
})
export class NotificationListComponent {
  @Input() notifications: NotificationI[] = [];
  @Output() notificationSelected = new EventEmitter<NotificationI>();

  onSelectNotification(notification: NotificationI): void {
    this.notificationSelected.emit(notification);
  }
}
