import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, ButtonComponent, AngularSvgIconModule, ReactiveFormsModule, NgIf, NgClass],
})
export class NewPasswordComponent implements OnInit {
  resetToken: string | null = null;
  newPasswordForm!: FormGroup;
  isSubmitting = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {
    // Crear nuevo formgroup para la nueva contraseña

    this.newPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Capturar el token de la URL
    this.resetToken = this.route.snapshot.queryParamMap.get('token');

    if (!this.resetToken) {
      // Si no hay token, redirigir a una página de error o al inicio de sesión
      console.error('No reset token found in the URL.');
      this.router.navigate(['/auth/sign-in']);
      return;
    }

    // Crear el formulario para la nueva contraseña
    // this.newPasswordForm = this.fb.group(
    //   {
    //     password: ['', [Validators.required, Validators.minLength(6)]],
    //     confirmPassword: ['', [Validators.required]],
    //   },
    //   { validator: this.passwordsMatchValidator },
    // );
  }

  // Validador para asegurarse de que las contraseñas coincidan
  passwordsMatchValidator(form: FormGroup) {
    return form.get(['password'])!.value === form.get(['confirmPassword'])!.value ? null : { mismatch: true };
  }

  // Alternar la visibilidad de la contraseña
  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.newPasswordForm.invalid || !this.resetToken) {
      return;
    }

    this.isSubmitting = true;

    // Correcto
    const newPassword = this.newPasswordForm.get(['password'])!.value;

    this.authService.resetPassword(this.resetToken, newPassword).subscribe({
      next: () => {
        console.log('Password reset successful');
        // Redirigir al login u otra página después de un restablecimiento exitoso
        this.router.navigate(['/auth/sign-in']);
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.isSubmitting = false;
        // Mostrar mensaje de error al usuario
      },
    });
  }

  get f() {
    return this.newPasswordForm.controls;
  }
}
