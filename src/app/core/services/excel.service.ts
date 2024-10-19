import * as XLSX from 'xlsx';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  /**
   * Método para descargar los datos en formato Excel.
   * @param data Array con los datos a exportar.
   * @param headers Array con los nombres de las columnas.
   * @param fileName Nombre del archivo a generar.
   */
  downloadExcel(data: Record<string, string | number>[], headers: string[], fileName: string) {
    // Crear un nuevo libro de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Guardar el archivo usando la función saveAs de FileSaver.js (opcional)
    this.saveAsExcelFile(excelBuffer, `${fileName}.xlsx`);
  }

  /**
   * Método para guardar el archivo Excel generado.
   * @param buffer El contenido del archivo en formato buffer.
   * @param fileName El nombre del archivo a guardar.
   */
  private saveAsExcelFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
