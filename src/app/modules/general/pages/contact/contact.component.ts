import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactInfo = {
    address: 'Calle de, Alfonso XIII, nº15, 36201 Vigo, PO',
    phone: '986 298 735',
    email: 'info@arcodavella.gal',
  };

  emailData = {
    name: '',
    email: '',
    message: '',
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  // Método para enviar el correo a través del formulario de contacto
  onSubmit(form: NgForm) {
    if (form.valid) {
      const emailPayload = {
        name: this.emailData.name,
        email: this.emailData.email,
        message: this.emailData.message,
      };

      this.http.post('/api/send-email', emailPayload).subscribe(
        (response) => {
          this.snackBar.open('Correo enviado con éxito.', 'Cerrar', {
            duration: 3000,
          });
          form.resetForm();
        },
        (error) => {
          this.snackBar.open('Error al enviar el correo. Inténtalo de nuevo.', 'Cerrar', {
            duration: 3000,
          });
        },
      );
    }
  }
}
