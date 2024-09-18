import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-change-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-change-request.component.html',
  styleUrl: './data-change-request.component.scss',
})
export class DataChangeRequestComponent {
  @Input() dataChangeRequests!: {
    requestType: string;
    requestedBy: string;
    date: Date;
    status: string;
  }[];
}
