import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as DOMPurify from 'dompurify';
import { PdfService } from 'src/app/core/services/pdf.service';
import { TemplateService } from 'src/app/core/services/template.service';

@Component({
  selector: 'app-preview-mensaje',
  templateUrl: './preview-mensaje.component.html',
  styleUrls: ['./preview-mensaje.component.scss'],
  encapsulation: ViewEncapsulation.None, // Asegura que los estilos se apliquen globalmente dentro del componente
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
})
export class PreviewMensajeComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() usuarios: any[] = [];
  @Input() listas: any[] = [];

  templates: { name: string }[] = [];
  selectedTemplateName: string = 'Convocatoria Asamblea'; // Plantilla por defecto
  emailContent: SafeHtml = '';

  // Para el PDF
  showPdfPreview: boolean = false;
  pdfSrc: SafeHtml | undefined;
  pdfVisible: boolean = false; // Controla la visibilidad del PDF

  constructor(
    private templateService: TemplateService,
    private sanitizer: DomSanitizer,
    private pdfService: PdfService,
  ) {}

  ngOnInit(): void {
    // Obtener las plantillas disponibles
    this.templates = this.templateService.getTemplates();

    // Cargar la plantilla seleccionada
    this.loadTemplate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] || changes['selectedTemplateName']) {
      this.loadTemplate();
    }
  }

  // Cargar el contenido de la plantilla
  loadTemplate(): void {
    console.log('Mensaje original:', this.message);

    // Utilizar el mensaje HTML directamente sin manipular las listas
    const messageHtml = this.message;

    // Obtener el HTML con la plantilla seleccionada sin modificar el formato de las listas
    const rawHtml = this.templateService.getTemplateByName(this.selectedTemplateName, messageHtml);

    // Sanitizar el HTML resultante
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
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
      ALLOWED_ATTR: ['style', 'class', 'src', 'href', 'alt', 'title', 'align'],
    });

    console.log('Clean HTML:', cleanHtml);
    this.emailContent = cleanHtml as string;

    // Mostrar u ocultar el PDF adjunto según la plantilla seleccionada
    if (this.selectedTemplateName === 'Convocatoria Asamblea') {
      this.showPdfPreview = true;
      this.generatePdfPreview();
    } else {
      this.showPdfPreview = false;
      this.pdfVisible = false;
    }
  }

  // Manejar el cambio de plantilla desde el dropdown
  onTemplateChange(): void {
    this.loadTemplate();
  }

  // Generar la vista previa del PDF
  async generatePdfPreview(): Promise<void> {
    const pdfDataUrl = await this.pdfService.generatePdfDataUrl({
      numSocio: '12345',
      nombre: 'Juan Pérez',
      dni: '12345678A',
      email: 'juan.perez@example.com',
    });
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdfDataUrl);
  }

  // Alternar la visibilidad del PDF adjunto
  togglePdfPreview(): void {
    this.pdfVisible = !this.pdfVisible;
  }
}
