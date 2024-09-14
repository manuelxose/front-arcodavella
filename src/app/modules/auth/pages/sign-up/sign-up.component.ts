import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';
import { NgClass, NgIf } from '@angular/common';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { evaluatePasswordStrength } from 'src/app/shared/utils/password';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, AngularSvgIconModule, NgClass, NgIf, ButtonComponent],
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  submitted: boolean = false;

  // Variables to manage visibility of passwords
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordStrength: number = 0; // Variable to hold the strength score

  constructor(private authService: AuthService, private router: Router, private readonly _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.signUpForm = this._formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, Validators.requiredTrue],
      },
      {
        validator: this.mustMatch('password', 'confirmPassword'),
      },
    );
  }

  // Toggle visibility for password
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Toggle visibility for confirm password
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Método para acceder fácilmente a los controles del formulario
  get f(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }

    const email = this.signUpForm.get('email')?.value;
    const password = this.signUpForm.get('password')?.value;

    this.authService.register(email, password).subscribe({
      next: (user: User) => {
        console.log('SignUpComponent: Registration successful', user);
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('SignUpComponent: Registration failed', err);
      },
    });
  }

  mustMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Inside SignUpComponent

  // This method is called when the user inputs a password
  onPasswordInput(): void {
    const password = this.signUpForm.get('password')?.value || '';

    this.passwordStrength = evaluatePasswordStrength(password);
    console.log('entra', password, this.passwordStrength);
  }
}
