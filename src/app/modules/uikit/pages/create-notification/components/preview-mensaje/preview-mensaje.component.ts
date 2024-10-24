// src/app/modules/uikit/pages/create-notification/components/preview-mensaje/preview-mensaje.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurify from 'dompurify';
import { PdfService } from 'src/app/core/services/pdf.service';
import { TemplateService } from 'src/app/core/services/template.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { PdfData } from '../../models/pdf.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-preview-mensaje',
  templateUrl: './preview-mensaje.component.html',
  styleUrls: ['./preview-mensaje.component.scss'],
  encapsulation: ViewEncapsulation.None, // Asegura que los estilos se apliquen globalmente dentro del componente
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule, // Añadir MatNativeDateModule aquí
  ],
})
export class PreviewMensajeComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() usuarios: any[] = [];
  @Input() listas: any[] = [];

  @Input() assemblyDate: string = ''; // Fecha de la Asamblea como ISO string
  @Input() currentDate: string = ''; // Fecha actual como ISO string

  @Output() templateChanged = new EventEmitter<string>();
  @Output() assemblyDateChanged = new EventEmitter<string>();
  @Output() emailContentChanged = new EventEmitter<SendEmailContent>(); // Nuevo Output para el contenido del email

  templates: { name: string }[] = [];
  selectedTemplateName: string = 'Convocatoria Asamblea'; // Plantilla por defecto
  emailContent: SafeHtml = '';

  // Para el PDF
  showPdfPreview: boolean = true;
  pdfSrc: SafeHtml | undefined;
  pdfVisible: boolean = false; // Controla la visibilidad del PDF

  constructor(
    private templateService: TemplateService,
    private sanitizer: DomSanitizer,
    private pdfService: PdfService,
    private snackBar: MatSnackBar, // Añadido para mostrar notificaciones
  ) {}

  ngOnInit(): void {
    // Obtener las plantillas disponibles
    this.templates = this.templateService.getTemplates();

    // Cargar la plantilla seleccionada
    this.loadTemplate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] || changes['selectedTemplateName'] || changes['assemblyDate'] || changes['currentDate']) {
      this.loadTemplate();
    }
  }

  /**
   * Cargar el contenido de la plantilla, sanitizarlo y emitirlo al padre.
   */
  loadTemplate(): void {
    // Utilizar el mensaje HTML directamente sin manipular las listas
    const messageHtml = this.message;

    // Obtener el HTML con la plantilla seleccionada sin modificar el formato de las listas
    const rawHtml = this.templateService.getTemplateByName(this.selectedTemplateName, messageHtml);

    // Sustituir las referencias cid por rutas de imágenes locales para la vista previa
    const previewHtml = this.replaceCidWithSrc(rawHtml);

    // Sanitizar el HTML resultante
    const cleanHtml = DOMPurify.sanitize(previewHtml, {
      ALLOWED_TAGS: [
        'div',
        'span',
        'p',
        'img',
        'a',
        'strong',
        'em',
        'br',
        'ul',
        'ol',
        'li',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'blockquote',
        'pre',
        'code',
      ],
      ALLOWED_ATTR: ['style', 'class', 'src', 'href', 'alt', 'title', 'align', 'width', 'height'],
    });

    // Inlining de estilos para compatibilidad con clientes de correo
    const inlinedHtml = this.inlineStyles(cleanHtml);

    this.emailContent = this.sanitizer.bypassSecurityTrustHtml(inlinedHtml);

    // Emitir el contenido del email al padre
    this.emailContentChanged.emit({
      htmlContent: rawHtml, // Enviar el HTML original con 'cid:...' para el envío
      plainTextContent: this.message, // Opcional: contenido de texto plano
    });

    // Generar la vista previa del PDF si la plantilla es "Convocatoria Asamblea"
    if (this.selectedTemplateName === 'Convocatoria Asamblea') {
      this.generatePdfPreview();
    } else {
      this.pdfSrc = undefined;
      this.pdfVisible = false;
    }
  }

  /**
   * Reemplaza las referencias 'cid:...' en los src de las imágenes por rutas locales.
   * @param html El HTML original con referencias 'cid:...'
   * @returns El HTML con las referencias 'cid:...' reemplazadas por rutas locales.
   */
  private replaceCidWithSrc(html: string): string {
    // Define un mapeo de cids a rutas locales
    const cidToSrcMap: { [key: string]: string } = {
      'cid:logo@arcodavella': '../../../assets/icons/logo-arcodavella.png',
      // Agrega más mapeos si tienes más imágenes con cids
    };

    // Reemplazar cada cid con la ruta correspondiente
    let modifiedHtml = html;
    for (const [cid, src] of Object.entries(cidToSrcMap)) {
      const regex = new RegExp(`src=["']${cid}["']`, 'g');
      modifiedHtml = modifiedHtml.replace(regex, `src="${src}"`);
    }

    return modifiedHtml;
  }

  /**
   * Método para inlinear estilos CSS en el HTML.
   * @param html El HTML al que se le deben inlinear los estilos.
   * @returns El HTML con estilos inlineados.
   */
  private inlineStyles(html: string): string {
    // Puedes usar una librería como Juice para inlinear estilos.
    // Aquí se muestra un ejemplo básico sin librerías externas.
    // Para una solución más robusta, considera instalar Juice: https://www.npmjs.com/package/juice

    // Por simplicidad, retornamos el HTML tal cual.
    // Recomendado: Implementar inlining con Juice u otra herramienta.
    return html;
  }

  /**
   * Emitir el cambio de plantilla al componente padre.
   */
  onTemplateChange(): void {
    this.templateChanged.emit(this.selectedTemplateName);
  }

  /**
   * Generar la vista previa del PDF.
   */
  async generatePdfPreview(): Promise<void> {
    if (!this.assemblyDate || !this.currentDate) {
      this.snackBar.open('Las fechas de Asamblea y actual no están definidas.', 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    const pdfData: PdfData = {
      numSocio: '12345',
      nombre: 'Juan Pérez',
      dni: '12345678A',
      email: 'juan.perez@example.com',
      assemblyDate: this.assemblyDate, // Fecha como ISO string
      currentDate: this.currentDate, // Fecha como ISO string
    };

    try {
      const pdfDataUrl = await this.pdfService.generatePdfDataUrl(pdfData);
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUrl);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      this.snackBar.open('Error al generar el PDF.', 'Cerrar', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  /**
   * Alternar la visibilidad del PDF adjunto.
   */
  togglePdfPreview(): void {
    this.pdfVisible = !this.pdfVisible;
  }

  /**
   * Emitir cambios en la fecha de la asamblea.
   */
  onAssemblyDateChange(event: any): void {
    const selectedDate: Date = event.value;
    if (selectedDate) {
      const isoDate = selectedDate.toISOString();
      this.assemblyDateChanged.emit(isoDate);
      console.log('Fecha de Asamblea emitida al padre:', isoDate);
    }
  }

  /**
   * Limpiar el componente al destruirlo.
   */
  ngOnDestroy(): void {
    // Implementar si es necesario
  }
}

/**
 * Interface para el contenido del email que se emitirá al componente padre.
 */
export interface SendEmailContent {
  htmlContent: string;
  plainTextContent: string;
}
