import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-notification-search',
  standalone: true,
  imports: [],
  templateUrl: './notification-search.component.html',
  styleUrl: './notification-search.component.scss',
})
export class NotificationSearchComponent {
  @Output() searchQuery = new EventEmitter<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.emit(value);
  }
}
