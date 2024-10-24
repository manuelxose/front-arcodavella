// src/app/modules/uikit/pages/create-notification/create-notification/pdf.service.ts

import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Observable, Subject } from 'rxjs';
import html2canvas from 'html2canvas';
import qrcode from 'qrcode-generator';

interface PdfGenerationResult {
  pdfDataUrl: string;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private pdfWorker!: Worker;
  private pdfResultSubject = new Subject<PdfGenerationResult>();
  private pdfErrorSubject = new Subject<string>();
  private pdfProgressSubject = new Subject<string>();

  constructor() {
    console.log('PdfService constructor: Inicializando Web Worker...');
    if (typeof Worker !== 'undefined') {
      try {
        // Utiliza import.meta.url para resolver la ruta correctamente
        // this.pdfWorker = new Worker(new URL('../../pdf.worker.ts', import.meta.url), { type: 'module' });

        this.pdfWorker = new Worker(new URL('./pdf.worker', import.meta.url), { type: 'module' });
        console.log('PdfService constructor: Web Worker creado exitosamente.');

        // Escuchar mensajes desde el Web Worker
        this.pdfWorker.onmessage = ({ data }) => {
          console.log('PdfService: Mensaje recibido del Web Worker:', data);
          if (data.error) {
            this.pdfErrorSubject.next(data.error);
          } else if (data.progress) {
            // Maneja la actualización de progreso
            this.pdfProgressSubject.next(data.progress);
          } else if (data.pdfDataUrl && data.duration) {
            this.pdfResultSubject.next({
              pdfDataUrl: data.pdfDataUrl,
              duration: data.duration,
            });
          }
        };

        // Manejar errores del Web Worker
        this.pdfWorker.onerror = (error) => {
          console.error('PdfService: Error del Web Worker:', error);
          this.pdfErrorSubject.next(error.message);
        };
      } catch (error) {
        console.error('PdfService: Error al instanciar el Web Worker:', error);
        this.pdfErrorSubject.next('Error al instanciar el Web Worker.');
      }
    } else {
      console.error('PdfService: Web Workers no están soportados en este navegador.');
      this.pdfErrorSubject.next('Web Workers no están soportados en este navegador.');
    }
  }

  /**
   * Genera un PDF utilizando el Web Worker y devuelve un Observable con el resultado.
   * @param pdfData Los datos necesarios para generar el PDF.
   * @param title El título de la notificación.
   * @param message El mensaje de la notificación.
   * @param previewImage Una imagen de vista previa opcional.
   * @returns Observable que emite el resultado de la generación del PDF.
   */
  /**
   * Genera un PDF utilizando el Web Worker y devuelve un Observable con el resultado.
   */
  generatePdf(
    pdfData: { numSocio: string; nombre: string; dni: string; email: string | string[] },
    _title: string,
    _message: string,
    previewImage: string | null,
  ): Observable<PdfGenerationResult> {
    console.log('PdfService: Iniciando generación de PDF...');
    return new Observable((observer) => {
      if (!this.pdfWorker) {
        console.error('PdfService: Web Worker no está inicializado.');
        observer.error('Web Worker no está inicializado.');
        return;
      }

      // Generar el QR Code como Data URL
      const qrData = `${pdfData.numSocio}|${pdfData.nombre}|${pdfData.dni}|${
        Array.isArray(pdfData.email) ? pdfData.email.join(', ') : pdfData.email
      }`.trim();
      this.toDataURL(qrData)
        .then((qrImageUrl) => {
          console.log('PdfService: Enviando datos al Web Worker:', { pdfData, previewImage, qrImageUrl });
          // Enviar el mensaje al Web Worker con qrImageUrl
          this.pdfWorker.postMessage({
            pdfData,
            qrImageUrl,
            previewImage,
          });
        })
        .catch((err) => {
          console.error('PdfService: Error generando el QR Code:', err);
          observer.error('Error generando el QR Code: ' + err.message);
        });

      // Suscribirse a los Subjects para recibir mensajes del worker
      const resultSubscription = this.pdfResultSubject.subscribe({
        next: (result) => {
          console.log('PdfService: PDF generado exitosamente:', result);
          observer.next(result);
          observer.complete();
        },
        error: (err) => {
          console.error('PdfService: Error en el resultado del PDF:', err);
          observer.error(err);
        },
      });

      const errorSubscription = this.pdfErrorSubject.subscribe({
        next: (error) => {
          console.error('PdfService: Error recibido del Web Worker:', error);
          observer.error(error);
        },
      });

      const progressSubscription = this.pdfProgressSubject.subscribe({
        next: (progress) => {
          // Emitir actualizaciones de progreso si es necesario
          console.log('PdfService: Progreso de generación de PDF:', progress);
        },
      });

      // Limpiar suscripciones cuando el Observable sea desuscrito
      return () => {
        resultSubscription.unsubscribe();
        errorSubscription.unsubscribe();
        progressSubscription.unsubscribe();
      };
    });
  }

  // Método para obtener actualizaciones de progreso
  getPdfProgress(): Observable<string> {
    return this.pdfProgressSubject.asObservable();
  }

  /**
   * Devuelve un Observable para manejar errores en la generación de PDFs.
   * @returns Observable que emite mensajes de error.
   */
  getPdfErrors(): Observable<string> {
    return this.pdfErrorSubject.asObservable();
  }

  /**
   * Genera un PDF personalizado con los datos proporcionados y lo devuelve como una URL de datos.
   * @param data Los datos del socio para incluir en el PDF.
   * @returns Una promesa que resuelve con la URL de datos del PDF generado.
   */
  async generatePdfDataUrl(data: {
    numSocio: string;
    nombre: string;
    dni: string;
    email: string | string[];
    assemblyDate?: string; // Fecha de la Asamblea como ISO string
    currentDate?: string; // Fecha actual como ISO string
  }): Promise<string> {
    const doc = new jsPDF();

    // Validar y parsear las fechas
    const assemblyDate = data.assemblyDate ? new Date(data.assemblyDate) : new Date();
    const currentDate = data.currentDate ? new Date(data.currentDate) : new Date();

    if (isNaN(assemblyDate.getTime())) {
      throw new Error('Fecha de la Asamblea inválida.');
    }

    if (isNaN(currentDate.getTime())) {
      throw new Error('Fecha actual inválida.');
    }

    // Formatear las fechas en formato español
    const formattedAssemblyDate = assemblyDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const formattedCurrentDate = currentDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Generar el código QR
    const qrData = `${data.numSocio}|${data.nombre}|${data.dni}|${
      Array.isArray(data.email) ? data.email.join(', ') : data.email
    }`;
    const qrImageUrl = await this.toDataURL(qrData); // Asegúrate de tener implementado este método

    // Añadir contenido al PDF

    // Título principal centrado en negrita
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('ASAMBLEA GENERAL ORDINARIA', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Subtítulo con la fecha de la asamblea
    doc.setFont('Helvetica', 'normal');
    doc.text(`Convocada para el día ${formattedAssemblyDate}`, doc.internal.pageSize.getWidth() / 2, 40, {
      align: 'center',
    });

    // Sección de admisión
    doc.setFontSize(14);
    doc.text('TARJETA DE ADMISIÓN:', 20, 60);

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text(`Socio/a Cooperativista: ${data.nombre}`, 20, 70);
    doc.setFont('Helvetica', 'normal');
    doc.text(`DNI: ${data.dni}`, 20, 80);

    // Añadir el código QR centrado
    const qrWidth = 50;
    const qrX = (doc.internal.pageSize.getWidth() - qrWidth) / 2;
    doc.addImage(qrImageUrl, 'PNG', qrX, 90, qrWidth, qrWidth);

    // Añadir cuadro antes de "DELEGO"
    doc.rect(20, 150, 5, 5); // Dibujar un cuadrado
    doc.text('DELEGO', 27, 154);

    // Texto de delegación
    const delegacionText =
      'Confiero mi representación para esta Asamblea a .............................................................. ' +
      'quien votará favorablemente las propuestas presentadas por el Consejo Rector, en relación con el Orden ' +
      'del Día recogido en el anverso y aquellas otras que, aun no estando en él incluidas, puedan válidamente ' +
      'suscitarse y resolverse en la Asamblea conforme a la Ley, salvo que se indique otra cosa en las siguientes ' +
      'instrucciones para el ejercicio del voto:';

    doc.setFontSize(12);
    const delegacionLines = doc.splitTextToSize(delegacionText, doc.internal.pageSize.getWidth() - 40);
    doc.text(delegacionLines, 20, 170);

    // Calcular la posición Y después del texto de delegación
    const textDimensions = doc.getTextDimensions(delegacionLines);
    const currentY = 170 + textDimensions.h + 10; // Añadir un margen de 10

    // Añadir líneas para instrucciones adicionales
    doc.text(
      '.............................................................................................................',
      20,
      currentY,
    );
    doc.text(
      '.............................................................................................................',
      20,
      currentY + 10,
    );
    doc.text(
      '.............................................................................................................',
      20,
      currentY + 20,
    );
    doc.text('..............................................................', 20, currentY + 30);

    // Lugar y fecha actual
    doc.text(`En Vigo, a ${formattedCurrentDate}`, 20, currentY + 50);

    // Firma
    doc.text('Firma Socio/a Cooperativista (OBLIGATORIA)', 20, currentY + 70);

    // Retornar el PDF como una URL de datos
    return doc.output('datauristring');
  }

  /**
   * Convierte una cadena de texto en una Data URL de una imagen QR.
   * @param data Cadena de texto para codificar en el QR.
   * @returns Una promesa que resuelve con la Data URL del QR generado.
   */
  private toDataURL(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const qr = qrcode(0, 'M'); // 0 = QR Code model 1-40, 'M' = Medium error correction
      qr.addData(data);
      qr.make();
      const qrImageUrl = qr.createDataURL();
      resolve(qrImageUrl);
    });
  }

  /**
   * Genera un PDF a partir de un elemento HTML.
   * @param element El elemento HTML que se quiere convertir a PDF.
   * @param fileName Nombre del archivo PDF resultante.
   */
  generatePdfFromHtml(element: HTMLElement, fileName: string): void {
    html2canvas(element, {
      useCORS: true, // Si usas imágenes desde URLs externas
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // Ancho de una página A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
    });
  }
}
