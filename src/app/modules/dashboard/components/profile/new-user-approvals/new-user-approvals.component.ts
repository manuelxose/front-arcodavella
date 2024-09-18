import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-new-user-approvals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-user-approvals.component.html',
  styleUrl: './new-user-approvals.component.scss',
})
export class NewwUserApprovalsComponent {
  @Input() newUserApprovals!: {
    username: string;
    email: string;
    date: Date;
    status: string;
  }[];
}
