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
  public formulario!: FormGroup;
  public enviado: boolean = false;
  public correoEnviado: boolean = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.formulario = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.formulario.controls;
  }

  onSubmit() {
    if (this.correoEnviado) {
      // Si el correo ya se ha enviado, no hacer nada
      return;
    }

    this.enviado = true;
    if (this.formulario.invalid) {
      console.log('El correo electrónico no es válido');
      return;
    }

    const email = this.formulario.get('email')?.value as string;
    console.log(email);

    this.authService.forgotPassword(email).subscribe({
      next: (data) => {
        console.log('Correo electrónico válido');
        console.log(data);
        this.correoEnviado = true; // Establecer correoEnviado a true
        // Aquí puedes manejar la redirección o mostrar un mensaje de éxito
      },
      error: (error) => {
        console.error('La solicitud de restablecimiento de contraseña falló', error);
        // Manejo de errores aquí
      },
    });
  }
}
