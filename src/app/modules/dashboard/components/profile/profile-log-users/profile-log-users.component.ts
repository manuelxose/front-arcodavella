import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-log-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-log-users.component.html',
  styleUrl: './profile-log-users.component.scss',
})
export class ProfileLogUsersComponent {
  @Input() userLogins!: {
    username: string;
    date: Date;
    status: string;
    ip: string;
  }[];
}
