import { Component } from '@angular/core';
import { ProfileCardComponent } from '../../components/profile/profile-card/profile-card.component';
import { ProfileLogUsersComponent } from '../../components/profile/profile-log-users/profile-log-users.component';
import { ProfileLogComponent } from '../../components/profile/profile-log/profile-log.component';
import { CommonModule } from '@angular/common';
import { DataChangeRequestComponent } from '../../components/profile/data-change-request/data-change-request.component';
import { NewwUserApprovalsComponent } from '../../components/profile/new-user-approvals/new-user-approvals.component';

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
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  activeTab: string = 'adminActions';

  adminActions = [
    {
      actionType: 'Crear Usuario',
      affectedUser: 'Juan Pérez',
      date: new Date(),
      details: 'El usuario Juan Pérez fue creado con éxito.',
    },
    {
      actionType: 'Eliminar Usuario',
      affectedUser: 'María López',
      date: new Date(),
      details: 'El usuario María López fue eliminado.',
    },
  ];

  userLogins = [
    {
      username: 'Juan Pérez',
      date: new Date(),
      status: 'Success',
      ip: '192.168.0.1',
    },
    {
      username: 'María López',
      date: new Date(),
      status: 'Failed',
      ip: '192.168.0.2',
    },
  ];

  dataChangeRequests = [
    {
      requestType: 'Cambio de Dirección',
      requestedBy: 'Juan Pérez',
      date: new Date(),
      status: 'Pendiente',
    },
    {
      requestType: 'Cambio de Teléfono',
      requestedBy: 'María López',
      date: new Date(),
      status: 'Aprobado',
    },
  ];

  newUserApprovals = [
    {
      username: 'Carlos García',
      email: 'carlos.garcia@example.com',
      date: new Date(),
      status: 'Pendiente',
    },
    {
      username: 'Lucía Fernández',
      email: 'lucia.fernandez@example.com',
      date: new Date(),
      status: 'Aprobado',
    },
  ];

  onEditUser() {
    console.log('Edit user clicked');
  }

  onDeleteUser() {
    console.log('Delete user clicked');
  }
}
