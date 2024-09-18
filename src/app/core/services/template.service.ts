import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor() {}

  // Plantilla para Convocatoria Asamblea
  getConvocatoriaAsambleaTemplate(message: string): string {
    // No reemplazar \n por <br>, usar directamente el HTML emitido por Quill
    const formattedMessage = message;

    return `
      <div class="container">
        <div class="header">
          <img src="assets/icons/logo-arcodavella.png" alt="Logo">
        </div>
        <div class="content">
          ${formattedMessage}
        </div>
        <div class="footer">
          <p>&copy; 2024 Arco da Vella, Sociedade Cooperativa Galega. Todos los derechos reservados.</p>
        </div>
      </div>
    `;
  }

  // Plantilla para Notificación General
  getNotificacionGeneralTemplate(message: string): string {
    return `
      <div class="notification-content">
        ${message}
      </div>
    `;
  }

  // Obtener lista de plantillas
  getTemplates(): { name: string }[] {
    return [
      { name: 'Convocatoria Asamblea' },
      { name: 'Notificación General' },
      // Agrega más plantillas si es necesario
    ];
  }

  // Obtener contenido de la plantilla por nombre
  getTemplateByName(name: string, message: string): string {
    switch (name) {
      case 'Convocatoria Asamblea':
        return this.getConvocatoriaAsambleaTemplate(message);
      case 'Notificación General':
        return this.getNotificacionGeneralTemplate(message);
      default:
        return message; // Retorna el mensaje sin plantilla si no se encuentra
    }
  }
}
