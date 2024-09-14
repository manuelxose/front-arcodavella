import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationSearchComponent } from '../notification-search/notification-search.component';

@Component({
  selector: 'app-notification-sidebar',
  standalone: true,
  imports: [NotificationSearchComponent],
  templateUrl: './notification-sidebar.component.html',
  styleUrl: './notification-sidebar.component.scss',
})
export class NotificationSidebarComponent {
  @Input() totalNotifications = 0;
  @Input() pendingNotifications = 0;
  @Input() readNotifications = 0;
  @Input() acceptedNotifications = 0;

  @Output() filterSelected = new EventEmitter<'unread' | 'read' | 'all' | 'approved'>(); // Agregamos 'accepted'
  @Output() searchQuery = new EventEmitter<string>();

  activeFilter: 'all' | 'unread' | 'read' | 'approved' = 'all'; // Agregamos 'approved' aquí

  selectFilter(filter: 'all' | 'unread' | 'read' | 'approved'): void {
    this.activeFilter = filter;
    this.filterSelected.emit(filter); // Emitimos el filtro seleccionado
  }

  onSearchQuery(query: string): void {
    this.searchQuery.emit(query);
  }
}
