import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthService } from '../../../../core/services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType = false;
  isDisabled: boolean = true;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly authService: AuthService, // Inyectamos el servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Acceso rápido a los controles del formulario
  get f() {
    return this.form.controls;
  }

  // Cambia la visibilidad del texto de la contraseña
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  // Enviar formulario
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      console.log('Form is invalid');
      toast.error('Please fill in all required fields correctly.'); // Notificación de error si el formulario es inválido
      return;
    }

    const { email, password } = this.form.value;

    // Autenticación
    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user.status === 'active') {
          toast.success('Login successful!'); // Notificación de éxito
          console.log('Login successful, navigating to dashboard');
          this._router.navigate(['/dashboard/overview']); // Redirige a la ruta protegida si el usuario está activo
        } else {
          toast.error('Your account is inactive.'); // Notificación de cuenta inactiva
          console.log('User is inactive, navigating to auth/inactive');
          this._router.navigate(['/auth/inactive']); // Redirige a la ruta de usuario inactivo
        }
      },
      error: (error) => {
        toast.error(error?.message || 'Login failed.'); // Notificación de error en caso de fallo
        console.error('Login failed', error);
      },
    });
  }
}
