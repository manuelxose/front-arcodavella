import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-editor-mensaje',
  standalone: true,
  imports: [FormsModule, QuillModule],
  templateUrl: './editor-mensaje.component.html',
  styleUrls: ['./editor-mensaje.component.scss'],
})
export class EditorMensajeComponent {
  // Entrada para el título y el contenido del mensaje
  @Input() title: string = '';
  @Input() message: string = '';

  // Emitimos los cambios del título y del contenido del mensaje
  @Output() titleChange = new EventEmitter<string>();
  @Output() messageChange = new EventEmitter<string>();

  // Configuración del editor Quill
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'], // Formatos básicos
      [{ list: 'ordered' }, { list: 'bullet' }], // Listas
      ['link', 'image'], // Insertar enlaces e imágenes
      [{ align: [] }], // Alineación
      ['clean'], // Botón para limpiar formatos
    ],
    clipboard: {
      // Permitir pegar contenido con formato
      matchVisual: false,
    },
  };

  // Función que se ejecuta cuando el contenido del editor cambia
  onContentChanged(event: any) {
    this.messageChange.emit(event.html); // Emitimos el contenido HTML al componente padre
  }

  // Función que se ejecuta cuando el título cambia
  onTitleChanged() {
    this.titleChange.emit(this.title); // Emitimos el título al componente padre
  }
}
