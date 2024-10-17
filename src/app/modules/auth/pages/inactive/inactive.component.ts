import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-inactive',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './inactive.component.html',
  styleUrl: './inactive.component.scss',
})
export class InactiveComponent {
  constructor(private authService: AuthService, private router: Router) {}

  /** Cierra la sesión del usuario y redirige al inicio de sesión */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/sign-in']);
  }

  /** Navega a la página de contacto o soporte */
  contactSupport(): void {
    // Puedes redirigir a una página de contacto existente o abrir un modal
    this.router.navigate(['/contact']);
  }
}
