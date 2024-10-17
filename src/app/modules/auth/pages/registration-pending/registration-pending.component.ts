import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-registration-pending',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './registration-pending.component.html',
  styleUrl: './registration-pending.component.scss',
})
export class RegistrationPendingComponent {
  constructor(private router: Router, private authService: AuthService) {}

  /** Redirige al usuario al inicio */
  navigateToHome(): void {
    this.router.navigate(['/auth']);
  }

  /** Redirige al usuario al panel de control después de completar el registro */
  navigateToDashboard(): void {
    // Puedes implementar lógica adicional si es necesario
    this.router.navigate(['/dashboard']);
  }

  /** Redirige al usuario a la página de soporte */
  contactSupport(): void {
    this.router.navigate(['/contact']);
  }
}
