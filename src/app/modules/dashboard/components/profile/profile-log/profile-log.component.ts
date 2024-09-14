import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-log',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-log.component.html',
  styleUrl: './profile-log.component.scss',
})
export class ProfileLogComponent {
  @Input() adminActions!: {
    actionType: string;
    affectedUser: string;
    date: Date;
    details: string;
  }[];
}
