import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro'; // Import the html2canvas-pro package
import QRCode from 'qrcode';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  /**
   * Generates a PDF from an HTML element, processing unsupported colors and using optimizations.
   * @param element The HTML element to convert to PDF.
   * @param fileName The name of the resulting PDF file.
   */
  generatePdfFromHtml(element: HTMLElement, fileName: string): void {
    // Replace unsupported colors like 'oklch' before rendering
    this.replaceUnsupportedColors(element);

    // Create a canvas manually and set 'willReadFrequently' for optimization
    const canvas = document.createElement('canvas');
    canvas.getContext('2d', { willReadFrequently: true });

    html2canvas(element, {
      useCORS: true, // This option enables the use of images from different origins
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${fileName}.pdf`);
      })
      .catch((error) => {
        console.error('Error generating PDF from HTML:', error);
      });
  }

  /**
   * Adds text to an existing PDF document with customization options.
   * @param text The text to be added.
   * @param options Customization options like font size, style, and position.
   */
  addTextToPdf(
    text: string,
    options: {
      x: number;
      y: number;
      fontSize?: number;
      fontStyle?: 'bold' | 'italic' | 'normal';
      fontName?: string;
    } = { x: 10, y: 10 },
  ): jsPDF {
    const pdf = new jsPDF();
    const { x, y, fontSize = 12, fontStyle = 'normal', fontName = 'helvetica' } = options;

    // Set the font and style
    pdf.setFont(fontName, fontStyle);
    pdf.setFontSize(fontSize);
    pdf.text(text, x, y);

    return pdf;
  }

  /**
   * Generates a PDF with custom content, such as text and images, without HTML rendering.
   * @param content An array defining the content (text, images, etc.) to add to the PDF.
   * @param fileName The name of the resulting PDF file.
   */
  generateCustomPdf(content: Array<{ type: 'text' | 'image'; data: any; options: any }>, fileName: string): void {
    const pdf = new jsPDF();

    content.forEach((item) => {
      if (item.type === 'text') {
        const { x, y, fontSize = 12, fontStyle = 'normal', fontName = 'helvetica' } = item.options;
        pdf.setFont(fontName, fontStyle);
        pdf.setFontSize(fontSize);
        pdf.text(item.data, x, y);
      } else if (item.type === 'image') {
        const { x, y, width, height } = item.options;
        pdf.addImage(item.data, 'PNG', x, y, width, height);
      }
    });

    pdf.save(`${fileName}.pdf`);
  }

  /**
   * Replaces unsupported CSS color formats, like 'oklch', with a supported fallback.
   * @param element The root element to search for unsupported colors.
   */
  replaceUnsupportedColors(element: HTMLElement): void {
    const allElements = element.querySelectorAll('*');

    allElements.forEach((el) => {
      const styles = window.getComputedStyle(el);
      const backgroundColor = styles.getPropertyValue('background-color');

      // Check if the color is using the unsupported 'oklch' format
      if (backgroundColor.includes('oklch')) {
        // Replace with a fallback color, for example, transparent or a supported rgba color
        (el as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Transparent as a fallback
      }
    });
  }

  /**
   * Genera un PDF personalizado con los datos proporcionados y lo devuelve como una URL de datos.
   * @param data Los datos del socio para incluir en el PDF.
   * @returns Una promesa que resuelve con la URL de datos del PDF generado.
   */
  async generatePdfDataUrl(data: { numSocio: string; nombre: string; dni: string; email: string }): Promise<string> {
    const doc = new jsPDF();

    // Generar el código QR
    const qrData = `${data.numSocio}|${data.nombre}|${data.dni}|${data.email}`;
    const qrImageUrl = await QRCode.toDataURL(qrData);

    // Añadir contenido al PDF

    // Título principal centrado en negrita
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('ASAMBLEA GENERAL ORDINARIA', doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    doc.setFont('Helvetica', 'normal');
    doc.text('convocada para el día 2 de julio de 2024', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

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
    let currentY = 170 + textDimensions.h + 10; // Añadir un margen de 10

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

    // Lugar y fecha
    doc.text('En Vigo, a 14 de junio de 2024', 20, currentY + 50);

    // Firma
    doc.text('Firma Socio/a Cooperativista (OBLIGATORIA)', 20, currentY + 70);

    // Retornar el PDF como una URL de datos
    return doc.output('datauristring');
  }
}
