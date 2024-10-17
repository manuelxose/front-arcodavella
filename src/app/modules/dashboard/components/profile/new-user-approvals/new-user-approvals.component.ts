import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-new-user-approvals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-user-approvals.component.html',
  styleUrl: './new-user-approvals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimized change detection
})
export class NewwUserApprovalsComponent implements OnInit {
  @Input() newUserApprovals!: {
    username: string;
    email: string;
    date: Date;
    status: string;
  }[];

  constructor() {}

  ngOnInit(): void {
    console.log('New user approvals:', this.newUserApprovals);
  }
}
