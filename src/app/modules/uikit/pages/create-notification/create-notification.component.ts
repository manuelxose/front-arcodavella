import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-create-notification',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass, QuillModule, CommonModule, AngularSvgIconModule],
  templateUrl: './create-notification.component.html',
})
export class CreateNotificationComponent {
  message: string = ''; // Mensaje en formato HTML
  type: string = 'info'; // Tipo de notificación por defecto
  previewImage: any = null; // Imagen previsualizada
  title: string = ''; // Título de la notificación

  // Configuración del editor Quill
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'], // Formatos básicos
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas
      ['link', 'image'], // Insertar enlaces e imágenes
      [{ align: [] }], // Alineación
    ],
  };

  // Método para obtener las clases según el tipo de notificación
  getNotificationClasses() {
    const baseClasses = 'text-white p-4 rounded-lg shadow-md';

    switch (this.type) {
      case 'success':
        return `${baseClasses} bg-green-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-500`;
      case 'error':
        return `${baseClasses} bg-red-500`;
      case 'promotion':
        return `${baseClasses} bg-purple-500`;
      default:
        return `${baseClasses} bg-blue-500`; // Información por defecto
    }
  }

  // Método para manejar la selección de imágenes y su previsualización
  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewImage = e.target.result; // Actualiza la imagen previsualizada
    };
    reader.readAsDataURL(file);
  }

  sendNotification() {
    // Aquí iría la lógica para enviar la notificación (p.ej., una petición HTTP a un backend)
    console.log(`Notificación enviada: ${this.message} con tipo ${this.type}`);
  }
}
