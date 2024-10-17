/// <reference lib="webworker" />

import { jsPDF } from 'jspdf';
import qrcode from 'qrcode-generator';

// Definir la interfaz para los datos que se recibirán
interface PdfData {
  numSocio: string;
  nombre: string;
  dni: string;
  email: string;
  logoImageUrl?: string | null; // Data URL del logo (opcional)
  assemblyDate: string; // Fecha de la Asamblea como ISO string
  currentDate: string; // Fecha actual como ISO string
}

addEventListener('message', async ({ data }) => {
  const { pdfData, previewImage } = data as {
    pdfData: PdfData;
    previewImage: string | null;
  };

  try {
    const startTime = performance.now();
    console.log('Data en el worker', pdfData);

    // Reconstruir objetos Date a partir de las cadenas ISO
    const assemblyDate = new Date(pdfData.assemblyDate);
    const currentDate = new Date(pdfData.currentDate);

    // Validar las fechas
    if (isNaN(assemblyDate.getTime())) {
      throw new Error('Fecha de la Asamblea inválida.');
    }
    if (isNaN(currentDate.getTime())) {
      throw new Error('Fecha actual inválida.');
    }

    // Generar el código QR como Data URL usando qrcode-generator
    const qr = qrcode(0, 'M'); // 0 = QR Code model 1-40, 'M' = Medium error correction
    const qrDataString = `${pdfData.numSocio}|${pdfData.nombre}|${pdfData.dni}|${pdfData.email}`.trim();
    qr.addData(qrDataString);
    qr.make();
    const qrImageUrl = qr.createDataURL();

    // Crear el documento PDF
    const doc = new jsPDF();

    // Definir márgenes y dimensiones de la página
    const leftMargin = 20;
    const rightMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Posición Y inicial
    let currentY = 20;

    // Añadir el logo en la esquina superior izquierda (si existe)
    if (pdfData.logoImageUrl) {
      const logoWidth = 50; // Ajustar según sea necesario
      const logoHeight = 50; // Mantener proporción
      const logoX = leftMargin; // Posición X fija para alineación
      doc.addImage(pdfData.logoImageUrl, 'PNG', logoX, currentY, logoWidth, logoHeight);
    }

    // Título principal centrado en negrita
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('ASAMBLEA GENERAL ORDINARIA', pageWidth / 2, currentY + 10, { align: 'center' });

    // Incrementar currentY después del título
    currentY += 25; // 20 (inicial) + 50 (logo altura) / 2 + espacio

    // Subtítulo centrado con fecha de asamblea
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const formattedAssemblyDate = assemblyDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`Convocada para el día ${formattedAssemblyDate}`, pageWidth / 2, currentY, { align: 'center' });

    // Incrementar currentY después del subtítulo
    currentY += 15;

    // Subtítulo "TARJETA DE ADMISION:" alineado a la izquierda
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('TARJETA DE ADMISION:', leftMargin, currentY, { align: 'left' });

    // Incrementar currentY después del subtítulo de admisión
    currentY += 10;

    // Información del socio alineada a la izquierda
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Socio/a Cooperativista: ${pdfData.nombre}`, leftMargin, currentY, { align: 'left' });

    // Incrementar currentY después del nombre
    currentY += 10;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`DNI: ${pdfData.dni}`, leftMargin, currentY, { align: 'left' });

    // Incrementar currentY después del DNI
    currentY += 15;

    // Añadir el código QR centrado, tamaño 50x50
    const qrWidth = 50; // Reducido de 100 a 50 para reducir espacio
    const qrHeight = 50;
    const qrX = (pageWidth - qrWidth) / 2;
    doc.addImage(qrImageUrl, 'PNG', qrX, currentY, qrWidth, qrHeight);

    // Incrementar currentY después del QR
    currentY += qrHeight + 10;

    // Añadir un cuadrado antes de "DELEGO" alineado a la izquierda
    const squareSize = 8; // Reducido de 12 a 8
    const squareX = leftMargin; // Posición X fija
    const squareY = currentY;
    doc.rect(squareX, squareY, squareSize, squareSize).stroke();
    doc.text(' DELEGO', squareX + squareSize + 5, squareY + 6, { align: 'left' });

    // Incrementar currentY después del cuadrado y "DELEGO"
    currentY += squareSize + 10;

    // Texto de delegación alineado a la izquierda
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const delegacionText =
      'Confiero mi representación para esta Asamblea a …………………………………………………………. ' +
      'quien votará favorablemente las propuestas presentadas por el Consejo Rector, en relación con el Orden ' +
      'del Día recogido en el anverso y aquellas otras que, aun no estando en él incluidas, puedan válidamente ' +
      'suscitarse y resolverse en la Asamblea conforme a la Ley, salvo que se indique otra cosa en las siguientes ' +
      'instrucciones para el ejercicio del voto:';
    const delegacionLines = doc.splitTextToSize(delegacionText, pageWidth - leftMargin - rightMargin);
    doc.text(delegacionLines, leftMargin, currentY, { align: 'left' });

    // Incrementar currentY después del texto de delegación
    currentY += delegacionLines.length * 7 + 5;

    // Dibujar líneas punteadas más pequeñas
    drawDottedLine(doc, leftMargin, currentY, pageWidth - rightMargin, currentY, 3, 0.3);
    currentY += 5; // Espacio entre líneas
    drawDottedLine(doc, leftMargin, currentY, pageWidth - rightMargin, currentY, 3, 0.3);

    // Incrementar currentY después de las líneas punteadas
    currentY += 15;

    // Lugar y fecha actual alineados a la izquierda
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    const formattedCurrentDate = currentDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`En Vigo, a ${formattedCurrentDate}`, leftMargin, currentY, { align: 'left' });

    // Incrementar currentY después de la fecha
    currentY += 10;

    // Firma alineada a la izquierda
    doc.text('Firma Socio/a Cooperativista (OBLIGATORIA)', leftMargin, currentY, { align: 'left' });

    // Incrementar currentY después de la firma
    currentY += 20;

    // Añadir vista previa del mensaje si existe, dentro de la misma página
    if (previewImage) {
      const imageY = currentY;
      const imageWidth = pageWidth - leftMargin - rightMargin; // Ajustar para los márgenes
      const imageHeight = 40; // Reducido de 50 a 40 para ahorrar espacio

      // Verificar si hay suficiente espacio en la página
      if (imageY + imageHeight < pageHeight - 20) {
        // Añadir título de vista previa
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Vista Previa del Mensaje', leftMargin, imageY, { align: 'left' });

        // Añadir la imagen de vista previa
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.addImage(previewImage, 'PNG', leftMargin, imageY + 10, imageWidth, imageHeight);

        postMessage({ progress: 'Imagen de vista previa añadida al PDF' });
      } else {
        postMessage({
          progress: 'No hay suficiente espacio para añadir la imagen de vista previa en la misma página.',
        });
      }
    }

    // Generar el PDF como Data URL
    const pdfDataUrl = doc.output('datauristring');

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Enviar el resultado al hilo principal
    postMessage({ pdfDataUrl, duration });
  } catch (error: any) {
    postMessage({ error: error.message || 'Error generando el PDF' });
  }

  // Función para dibujar una línea punteada manualmente
  function drawDottedLine(
    doc: jsPDF,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dotSpacing: number = 3, // Reducido de 5 a 3
    dotRadius: number = 0.3, // Reducido de 0.5 a 0.3
  ) {
    const totalLength = Math.hypot(x2 - x1, y2 - y1);
    const dots = Math.floor(totalLength / dotSpacing);
    const dx = (x2 - x1) / totalLength;
    const dy = (y2 - y1) / totalLength;

    for (let i = 0; i < dots; i++) {
      const x = x1 + i * dotSpacing * dx;
      const y = y1 + i * dotSpacing * dy;
      doc.circle(x, y, dotRadius, 'F'); // 'F' para círculo relleno
    }
  }
});
