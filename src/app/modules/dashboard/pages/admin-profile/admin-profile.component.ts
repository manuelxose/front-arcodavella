import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCardComponent } from '../../components/profile/profile-card/profile-card.component';
import { ProfileLogUsersComponent } from '../../components/profile/profile-log-users/profile-log-users.component';
import { ProfileLogComponent } from '../../components/profile/profile-log/profile-log.component';
import { DataChangeRequestComponent } from '../../components/profile/data-change-request/data-change-request.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatabaseLogsService, Log } from 'src/app/core/services/database-logs.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { NotificationI } from 'src/app/core/models/notification.model';
import { catchError, map, of, Subscription, tap } from 'rxjs';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { RecipientTypes } from 'src/app/core/enums/recipient.enum';
import { NewwUserApprovalsComponent } from '../../components/profile/new-user-approvals/new-user-approvals.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ProfileCardComponent,
    ProfileLogUsersComponent,
    ProfileLogComponent,
    CommonModule,
    DataChangeRequestComponent,
    NewwUserApprovalsComponent,
    ButtonComponent,
    FormsModule,
  ],
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfileComponent implements OnInit, OnDestroy {
  activeTab = 'adminActions';
  user: User = {} as User;
  avatar: string = '';

  // Data variables for the template
  notifications: NotificationI[] = [];
  adminActions: NotificationI[] = [];
  dataChangeRequests: any[] = [];
  userLogins: Log[] = [];
  newUserApprovals: User[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly authSvc: AuthService,
    private readonly logSvc: DatabaseLogsService,
    private notificationSvc: NotificationService,
  ) {
    const user = this.authSvc.userValue;
    if (user) {
      this.user = user;
      this.avatar = `https://ui-avatars.com/api/?name=${this.user.name}`;
    }
  }

  ngOnInit(): void {
    // Subscribe to notification service and manually assign the values
    const notificationSub = this.notificationSvc.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
      console.debug('Notifications loaded:', notifications);
      // Manually update the adminActions and dataChangeRequests based on notifications
      this.adminActions = this.filterNotifications(RecipientTypes.ADMIN, StatusCodes.APPROVED, notifications);
      this.dataChangeRequests = this.filterNotifications(RecipientTypes.ADMIN, StatusCodes.PENDING, notifications);
    });

    // Subscribe to log service
    const logSubscription = this.logSvc.getLogs().subscribe({
      next: (logs: Log[]) => {
        console.log('data:', logs);
        this.userLogins = logs;
      },
      error: (error) => console.error('Error al obtener los logs:', error),
    });

    // Add subscriptions to the array for cleanup
    this.subscriptions.push(notificationSub, logSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Filters notifications based on recipient type and status.
   * @param recipientType - The recipient type to filter by.
   * @param status - The status code to filter by.
   * @param notifications - The full notifications list to filter.
   * @returns NotificationI[] - The filtered notifications.
   */
  private filterNotifications(
    recipientType: RecipientTypes,
    status: StatusCodes,
    notifications: NotificationI[],
  ): NotificationI[] {
    return notifications.filter((notif) => {
      const matches = notif.recipientType === recipientType && notif.status === status;
      console.debug('Notification matches filter:', notif, 'Matches:', matches);
      return matches;
    });
  }

  /**
   * Sets the active tab to the specified tab name.
   * @param tabName - The name of the tab to set as active.
   */
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  /**
   * Accepts a notification request by ID.
   * @param notificationId - The ID of the notification to accept.
   */
  acceptNotification(notificationId: string): void {
    this.notificationSvc.acceptRequest(notificationId);
  }
}
