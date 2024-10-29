import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TemplateService {
  constructor() {}

  // Plantilla Base
  private getBaseTemplate(content: string, title: string = 'Arco da Vella'): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
              color: #333333;
            }
            .container {
              max-width: 600px;
              margin: 50px auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #dddddd;
            }
            .header img {
              max-width: 150px;
              height: auto;
            }
            .content {
              padding: 20px 0;
              text-align: center;
            }
            .content h1 {
              font-size: 24px;
              color: #333333;
              margin-bottom: 10px;
            }
            .content p {
              font-size: 16px;
              line-height: 1.5;
              color: #555555;
              margin: 10px 0;
            }
            .content a.button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              font-size: 16px;
              color: #ffffff !important;
              background-color: #007BFF;
              text-decoration: none;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #777777;
              border-top: 1px solid #dddddd;
              padding-top: 10px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://arcodavella.gal/wp-content/uploads/2020/01/Logo-Arco-da-Vella-1980x760.png" alt="Arco da Vella" />
            </div>
            <div class="content">
              ${content}
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Arco da Vella, Sociedade Cooperativa Galega. Todos los derechos reservados.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Plantilla para Convocatoria Asamblea
  getConvocatoriaAsambleaTemplate(message: string): string {
    const content = `
      <h1>Convocatoria a Asamblea</h1>
      <p>${message}</p>
      <a href="http://portal.arcodavella.gal" class="button">Más Información</a>
    `;
    return this.getBaseTemplate(content, 'Convocatoria Asamblea');
  }

  // Plantilla para Notificación General
  getNotificacionGeneralTemplate(message: string): string {
    const content = `
      <h1>Notificación General</h1>
      <p>${message}</p>
      <a href="http://portal.arcodavella.gal" class="button">Visita nuestro sitio web</a>
    `;
    return this.getBaseTemplate(content, 'Notificación General');
  }

  // Plantilla para Bienvenida
  getWelcomeTemplate(): string {
    const content = `
      <h1>Bienvenido a Arco da Vella</h1>
      <p>Hola,</p>
      <p>Te damos la bienvenida a nuestra sección de socios. Estamos encantados de tenerte con nosotros.</p>
      <p>
        Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos a través de nuestro correo electrónico o teléfono.
      </p>
      <p>¡Esperamos verte pronto!</p>
      <a href="http://portal.arcodavella.gal" class="button">Visita nuestro sitio web</a>
    `;
    return this.getBaseTemplate(content, 'Bienvenida');
  }

  // Obtener lista de plantillas
  getTemplates(): { name: string }[] {
    return [
      { name: 'Convocatoria Asamblea' },
      { name: 'Notificación General' },
      { name: 'Bienvenida' },
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
      case 'Bienvenida':
        return this.getWelcomeTemplate();
      default:
        return this.getBaseTemplate(`<p>${message}</p>`, 'Mensaje');
    }
  }
}
