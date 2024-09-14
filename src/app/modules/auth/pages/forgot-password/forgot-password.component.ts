import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, ButtonComponent, NgIf, NgClass],
})
export class ForgotPasswordComponent implements OnInit {
  public form!: FormGroup;
  public submitted: boolean = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      console.log('Email is invalid');
      return;
    }

    const email = this.form.get('email')?.value as string; // Asegurarse de que es un string
    console.log(email);

    this.authService.forgotPassword(email).subscribe({
      next: (data) => {
        console.log('Valid Email');
        console.log(data);
        // Aquí puedes manejar la redirección o mostrar un mensaje de éxito
      },
      error: (error) => {
        console.error('Reset password request failed', error);
        // Manejo de errores aquí
      },
    });
  }
}
