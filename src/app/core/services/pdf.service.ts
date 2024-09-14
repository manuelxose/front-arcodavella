import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro'; // Import the html2canvas-pro package

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
}
