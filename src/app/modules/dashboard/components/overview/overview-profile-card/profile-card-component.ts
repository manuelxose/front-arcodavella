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
  imports: [NgStyle, CurrencyPipe, DatePipe, CommonModule, FontAwesomeModule],
})
export class OverviewProfileCardComponent implements OnInit {
  @Input() user: User = <User>{};

  showAccountNumber: boolean = false;

  constructor(library: FaIconLibrary, private readonly router: Router) {
    library.addIcons(faCamera, faEnvelope, faPhone, faMapMarkerAlt, faUniversity, faEdit, faComments);
  }

  ngOnInit(): void {}

  toggleAccountVisibility() {
    this.showAccountNumber = !this.showAccountNumber;
  }

  changeProfilePicture() {
    // Lógica para cambiar la foto de perfil
    alert('Funcionalidad para cambiar la foto de perfil.');
  }

  editProfile() {
    // Lógica para editar el perfil

    this.router.navigate(['/dashboard/member-profile']);
  }

  contactUser() {
    // Lógica para contactar al usuario
    this.router.navigate(['/general/contact']);
  }

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
