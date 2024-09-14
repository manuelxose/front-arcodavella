import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NotificationTypes } from 'src/app/core/enums/notification.enums';
import { RecipientTypes } from 'src/app/core/enums/recipient.enum';
import { StatusCodes } from 'src/app/core/enums/status.enum';
import { Member } from 'src/app/core/models/member.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-member-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularSvgIconModule],
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.scss',
})
export class MemberProfileComponent implements OnInit {
  member: Member = {} as Member;
  // Guardar los valores originales
  originalValues: Partial<Member> = {}; // Partial para que solo acepte campos de Member

  isEditing: { [key in keyof Member]?: boolean } = {}; // Limitar a las propiedades de Member
  isPendingApproval: { [key in keyof Member]?: boolean } = {};

  approvalMessage = '';
  showAccountNumber = false; // Para manejar el estado del blur
  private authData: any;

  constructor(
    private readonly userSvc: UserService,
    private readonly authSvc: AuthService,
    private readonly notificationSvc: NotificationService,
    private router: Router, // Inyecta Router para acceder a los datos del estado de navegación
  ) {
    this.authData = this.authSvc.userValue;
    this.member = this.authData;
  }

  ngOnInit() {
    // Verificar si hay datos en el estado de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userProfile: Member };

    if (state && state.userProfile) {
      // Si el estado tiene el perfil del usuario, lo asignamos
      this.member = state.userProfile;
      this.replacePendingWithNull(this.member); // Check for 'pending' values and replace with null
      console.log('Datos del usuario pasados al perfil: ', this.member);
    } else {
      // Si no hay datos en el estado, cargar el perfil desde el servidor usando el email
      this.member = this.authData;
      this.replacePendingWithNull(this.member); // Check for 'pending' values and replace with null
    }
  }

  // Utility function to replace 'pending' with null
  replacePendingWithNull(member: Member) {
    // Iterate over each key in the member object and replace 'pending' with null
    Object.keys(member).forEach((key) => {
      const memberKey = key as keyof Member; // Type cast to ensure correct type
      if (member[memberKey] === 'pending') {
        member[memberKey] = ''; // Replace 'pending' with null
      }
    });
  }

  // Cambia el estado para activar la edición del campo
  editField(field: keyof Member) {
    this.originalValues[field] = this.member[field];
    this.isEditing[field] = true;
  }

  // Simula el envío de la actualización
  sendUpdate(field: keyof Member) {
    this.isEditing[field] = false;
    this.isPendingApproval[field] = true;
    this.approvalMessage = `Tu ${field} está pendiente de aprobación.`;

    const notificationData = {
      recipientId: this.member.id,
      recipientType: RecipientTypes.USER,
      type: NotificationTypes.UPDATE_PROFILE,
      status: StatusCodes.PENDING,
      fieldToUpdate: field,
      newValue: this.member[field],
      message: `El campo ${field} ha sido solicitado para actualización. Nuevo valor propuesto: ${this.member[field]}`,
      title: 'Solicitud de actualización de perfil',
      summary: `Actualización del campo ${field}`,
    };

    this.notificationSvc.createNotification(notificationData);
  }

  // Cancelar la edición y restaurar el valor original
  cancelEdit(field: keyof Member) {
    if (this.originalValues[field] !== undefined) {
      this.member[field] = this.originalValues[field]!;
    }
    this.isEditing[field] = false;
  }

  toggleAccountNumber() {
    this.showAccountNumber = !this.showAccountNumber;
  }
}
