import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { toast } from 'ngx-sonner';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UtilsService } from '../../utils/transformDate';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-csv-modal',
  templateUrl: './upload-csv-modal.component.html',
  styleUrls: ['./upload-csv-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
})
export class UploadCsvModalComponent {
  csvFile: File | null = null;
  isVisible = false; // Controla la visibilidad del modal
  isValidFileName = false; // Controla si el nombre del archivo es válido
  fileNameError = ''; // Almacena el tipo de error del nombre del archivo

  // Definimos las cabeceras esperadas para asistencia y socios
  private expectedHeaders = {
    socios: ['NUM_SOCIO', 'NOMBRE', 'DNI', 'EMAIL', 'NUM_ACTUAL', 'OBSERVACIONES'],
    asistencia: ['NUM_SOCIO', 'DNI', 'EMAIL', 'NOMBRE', 'HORA_ENTRADA'],
  } as any;

  private apiUrl = `${environment.apiUrl}`; // URL base para las peticiones de asistencia

  constructor(private http: HttpClient, private papa: Papa) {}

  // Abrir el modal
  open() {
    this.isVisible = true;
  }

  // Cerrar el modal
  close() {
    this.isVisible = false;
  }

  // Método para seleccionar el archivo
  onFileSelected(event: any) {
    this.csvFile = event.target.files[0];

    if (this.csvFile) {
      const fileName = this.csvFile.name;
      const { isValid, errorType } = this.validateFileName(fileName);
      this.isValidFileName = isValid;
      this.fileNameError = errorType;
    } else {
      this.isValidFileName = false;
      this.fileNameError = '';
    }
  }

  // Método para subir el archivo
  onUpload() {
    if (this.csvFile && this.isValidFileName) {
      const fileName = this.csvFile.name;
      const { type } = this.validateFileName(fileName) as any;

      const fileExtension = this.getFileExtension(fileName);
      const extractedDate = this.extractDateFromFileName(fileName); // Extraer la fecha del nombre del archivo

      if (fileExtension === 'csv') {
        this.parseCsvFile(this.csvFile, type, extractedDate);
      } else if (['xls', 'xlsx', 'xlsm'].includes(fileExtension)) {
        this.parseExcelFile(this.csvFile, type, extractedDate);
      } else {
        toast.error('Por favor, suba un archivo CSV, Excel o Excel con macros válido.', { position: 'bottom-right' });
      }
    } else {
      toast.error('Por favor, seleccione un archivo CSV o Excel para subir.', { position: 'bottom-right' });
    }
  }

  // Validar el nombre del archivo
  private validateFileName(fileName: string): { isValid: boolean; errorType: string; type?: string } {
    const sociosPattern = /^lista_socios-\d{4}-\d{2}-\d{2}$/;
    const asistenciaPattern = /^lista_asistencia-\d{4}-\d{2}-\d{2}$/;

    const baseName = fileName.split('.')[0]; // Removemos la extensión del archivo
    const extension = this.getFileExtension(fileName);

    // Verificar si la extensión es válida
    if (!['csv', 'xls', 'xlsx', 'xlsm'].includes(extension)) {
      return { isValid: false, errorType: 'invalid_extension' };
    }

    // Verificar si falta la fecha en el formato esperado
    if (!baseName.includes('-') || !/\d{4}-\d{2}-\d{2}/.test(baseName)) {
      return { isValid: false, errorType: 'missing_date' };
    }

    // Verificar si es un archivo de socios o asistencia
    if (sociosPattern.test(baseName)) {
      return { isValid: true, errorType: '', type: 'socios' };
    } else if (asistenciaPattern.test(baseName)) {
      return { isValid: true, errorType: '', type: 'asistencia' };
    } else {
      return { isValid: false, errorType: 'invalid_format' };
    }
  }

  // Extraer la fecha del nombre del archivo en formato 'YYYY-MM-DD'
  private extractDateFromFileName(fileName: string): string {
    const regex = /\d{4}-\d{2}-\d{2}/;
    const match = fileName.match(regex);
    if (match) {
      return match[0]; // Devolver la fecha encontrada en el nombre del archivo
    }
    throw new Error('El archivo no tiene una fecha válida en el nombre.');
  }

  // Obtener la extensión del archivo
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  // Parsear archivo CSV
  private parseCsvFile(file: File, type: string, extractedDate: string) {
    this.papa.parse(file, {
      header: true,
      complete: (result) => {
        const headers = Object.keys(result.data[0]);
        if (this.validateHeaders(headers, type)) {
          const mappedData = this.mapHeaders(result.data, type, extractedDate);
          this.uploadToServer(mappedData, type);
        } else {
          toast.error('Las cabeceras del archivo no coinciden con el formato esperado.', { position: 'bottom-right' });
        }
      },
      error: (error) => {
        toast.error(`Error al analizar el archivo CSV: ${error.message}`, { position: 'bottom-right' });
      },
    });
  }

  // Parsear archivo Excel
  private parseExcelFile(file: File, type: string, extractedDate: string) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0] as any;
      const rows = jsonData.slice(1);
      const formattedData = this.mapRowsToJson(headers, rows);

      if (this.validateHeaders(headers, type)) {
        const mappedData = this.mapHeaders(formattedData, type, extractedDate);
        this.uploadToServer(mappedData, type);
      } else {
        toast.error('Las cabeceras del archivo no coinciden con el formato esperado.', { position: 'bottom-right' });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Validar que las cabeceras del archivo coincidan con las esperadas
  private validateHeaders(headers: string[], type: string): boolean {
    const expectedHeaders = this.expectedHeaders[type];
    return expectedHeaders.every((header: any) => headers.includes(header));
  }

  // Convertir filas de Excel a formato JSON
  private mapRowsToJson(headers: any[], rows: any[]): any[] {
    return rows.map((row: any) => {
      const obj: any = {};
      headers.forEach((header: any, index: any) => {
        obj[header] = row[index];
      });
      return obj;
    });
  }
  // Mapear cabeceras de los archivos a las que necesita el servidor
  private mapHeaders(data: any[], type: string, extractedDate: string) {
    return data
      .map((item) => {
        let entryTime;

        // Si HORA_ENTRADA es válido, lo formateamos; de lo contrario, usamos '99:99:99'
        if (item.HORA_ENTRADA) {
          entryTime = UtilsService.formatEntryDateTime(item.HORA_ENTRADA);
        } else {
          entryTime = `${extractedDate} 99:99:99`; // Añadir el día normal y poner la hora a 99:99:99
        }

        // Ensure all important fields are strings, or set them to default if needed
        const mappedData = {
          memberNumber: item.NUM_SOCIO ? String(item.NUM_SOCIO) : '99999', // Default to "99999" if undefined
          dni: item.DNI ? String(item.DNI).trim() : 'undefined', // Ensure it's a string, then trim
          email: item.EMAIL ? String(item.EMAIL) : 'undefined@undefined.undefined', // Default email
          name: item.NOMBRE ? String(item.NOMBRE) : 'undefined', // Default name
          entry: entryTime,
          date: extractedDate, // Extracted date from the file name
        };

        // Return null for rows where all important fields are undefined or contain 'undefined'
        if (
          mappedData.memberNumber === '99999' &&
          mappedData.dni === 'undefined' &&
          mappedData.email === 'undefined@undefined.undefined' &&
          mappedData.name === 'undefined'
        ) {
          return null;
        }

        return mappedData;
      })
      .filter((item) => item !== null); // Remove any null values from the final array
  }

  // Método reutilizable para enviar solicitudes HTTP POST
  private sendPostRequest(endpoint: string, data: any) {
    return this.http.post(endpoint, data, { withCredentials: true }).subscribe({
      next: (response) => {
        toast.success('Operación completada con éxito.', { position: 'bottom-right' });
        console.log('Response:', response); // For debugging purposes
        this.close(); // Close modal after success
      },
      error: (error) => {
        const errorMsg = error?.message || 'Error desconocido al procesar la solicitud.';
        toast.error(`Error al subir el archivo: ${errorMsg}`, { position: 'bottom-right' });
        console.error('Error:', error); // For debugging purposes
      },
    });
  }

  // Subir los datos al servidor
  private uploadToServer(jsonData: any, type: string) {
    const endpoint = type === 'socios' ? `${this.apiUrl}/socios/import` : `${this.apiUrl}/attendance/create`;
    console.log('Uploading data:', jsonData); // For debugging purposes

    // Llamar al método reutilizable para hacer el POST
    this.sendPostRequest(endpoint, jsonData);
  }
}
