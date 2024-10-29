import { Component, Input, OnInit } from '@angular/core';
import { NgStyle, CurrencyPipe, DatePipe, CommonModule } from '@angular/common';
import { User } from 'src/app/core/models/user.model';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faCamera,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faUniversity,
  faEdit,
  faComments,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'overview-profile-card',
  templateUrl: './profile-card.component.html',
  standalone: true,
  imports: [NgStyle, CurrencyPipe, CommonModule, FontAwesomeModule],
  providers: [DatePipe],
})
export class OverviewProfileCardComponent implements OnInit {
  @Input() user: User = <User>{};

  showAccountNumber: boolean = false;

  constructor(library: FaIconLibrary, private readonly router: Router, private datePipe: DatePipe) {
    library.addIcons(faCamera, faEnvelope, faPhone, faMapMarkerAlt, faUniversity, faEdit, faComments);
  }
  displayStatus: string = '';

  ngOnInit(): void {
    this.normalizeUserValues();
  }

  normalizeUserValues(): void {
    // Normaliza los valores de `user` directamente para mostrar valores amigables si están ausentes o pendientes
    this.user.name = this.user.name || 'Nombre no disponible';
    this.user.email = this.user.email !== 'pending' ? this.user.email : 'Email no disponible';
    this.user.phone = this.user.phone !== 'pending' ? this.user.phone : 'Teléfono no disponible';
    this.user.accountNumber =
      this.user.accountNumber !== 'pending'
        ? this.maskAccountNumber(this.user.accountNumber)
        : 'Número de cuenta no disponible';
    this.user.memberNumber =
      this.user.memberNumber !== 'pending' ? this.user.memberNumber : 'Número de miembro no disponible';

    // Usar una propiedad auxiliar para mostrar un estado amigable
    this.displayStatus = this.user.status && this.user.status !== 'pending' ? this.user.status : 'Estado no disponible';

    this.user.updatedAt = this.user.updatedAt
      ? this.datePipe.transform(this.user.updatedAt, 'longDate') || 'Fecha no disponible'
      : 'Fecha no disponible';
    this.user.address = this.user.address || 'Dirección no disponible';
  }

  toggleAccountVisibility() {
    this.showAccountNumber = !this.showAccountNumber;
  }

  changeProfilePicture() {
    alert('Funcionalidad para cambiar la foto de perfil.');
  }

  editProfile() {
    this.router.navigate(['/dashboard/member-profile']);
  }

  contactUser() {
    this.router.navigate(['/general/contact']);
  }

  // Máscara para el número de cuenta
  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber) {
      return '****';
    }
    const visibleDigits = 4;
    const maskedSection = accountNumber.slice(0, -visibleDigits).replace(/./g, '*');
    const visibleSection = accountNumber.slice(-visibleDigits);
    return maskedSection + visibleSection;
  }
}
