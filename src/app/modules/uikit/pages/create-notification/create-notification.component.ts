import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { QuillModule } from 'ngx-quill';
import { BusquedaUsuariosComponent } from './components/busqueda-usuarios/busqueda-usuarios.component';
import { SelectorListasComponent } from './components/selector-listas/selector-listas.component';
import { PreviewMensajeComponent } from './components/preview-mensaje/preview-mensaje.component';
import { EditorMensajeComponent } from './components/editor-mensaje/editor-mensaje.component';
import { NotificationTypeComponent } from './components/notification-type/notification-type.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-create-notification',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass,
    QuillModule,
    CommonModule,
    AngularSvgIconModule,
    BusquedaUsuariosComponent,
    SelectorListasComponent,
    PreviewMensajeComponent,
    EditorMensajeComponent,
    NotificationTypeComponent,
    MatCheckboxModule,
  ],
  templateUrl: './create-notification.component.html',
})
export class CreateNotificationComponent {
  message: string = ''; // Mensaje en formato HTML
  type: string = 'info'; // Tipo de notificación por defecto
  previewImage: any = null; // Imagen previsualizada
  title: string = ''; // Título de la notificación
  isSingleRecipient: boolean = false;
  usuariosSeleccionados: any[] = []; // Usuarios seleccionados
  listasSeleccionadas: any[] = []; // Listas seleccionadas

  // Configuración del editor Quill
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'], // Formatos básicos
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas
      ['link', 'image'], // Insertar enlaces e imágenes
      [{ align: [] }], // Alineación
    ],
  };

  agregarUsuario(usuario: any) {
    if (!this.usuariosSeleccionados.includes(usuario)) {
      this.usuariosSeleccionados.push(usuario);
    }
  }

  eliminarUsuario(usuario: any) {
    this.usuariosSeleccionados = this.usuariosSeleccionados.filter((u) => u !== usuario);
  }

  agregarListas(listas: any[]) {
    this.listasSeleccionadas = listas;
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

  toggleSingleRecipient(event: any) {
    if (this.isSingleRecipient) {
      // Limpiar los usuarios seleccionados si se selecciona un destinatario único
      this.usuariosSeleccionados = [];
      this.listasSeleccionadas = [];
    }
  }
}
