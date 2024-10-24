import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa, ParseResult } from 'ngx-papaparse';
import { toast } from 'ngx-sonner';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UtilsService } from '../../utils/transformDate';
import { environment } from 'src/environments/environment';

interface ExpectedHeaders {
  socios: string[];
  asistencia: string[];
}

interface MappedData {
  memberNumber: string;
  dni: string;
  email: string;
  name: string;
  entry: string;
  date: string;
}

type FileType = 'socios' | 'asistencia';

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
  private expectedHeaders: ExpectedHeaders = {
    socios: ['NUM_SOCIO', 'NOMBRE', 'DNI', 'EMAIL', 'NUM_ACTUAL', 'OBSERVACIONES'],
    asistencia: ['NUM_SOCIO', 'DNI', 'EMAIL', 'NOMBRE', 'HORA_ENTRADA'],
  };

  private apiUrl = `${environment.apiUrl}`; // URL base para las peticiones de asistencia

  constructor(private http: HttpClient, private papa: Papa) {}

  /**
   * Abrir el modal.
   */
  open(): void {
    this.isVisible = true;
  }

  /**
   * Cerrar el modal.
   */
  close(): void {
    this.isVisible = false;
  }

  /**
   * Método para seleccionar el archivo.
   * @param event Evento de cambio del input de archivo.
   */
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      this.csvFile = inputElement.files[0];

      const fileName = this.csvFile.name;
      const { isValid, errorType } = this.validateFileName(fileName);
      this.isValidFileName = isValid;
      this.fileNameError = errorType;
    } else {
      this.csvFile = null;
      this.isValidFileName = false;
      this.fileNameError = '';
    }
  }

  /**
   * Método para subir el archivo.
   */
  onUpload(): void {
    if (this.csvFile && this.isValidFileName) {
      const fileName = this.csvFile.name;
      const validationResult = this.validateFileName(fileName);

      if (validationResult.type && this.isFileTypeValid(validationResult.type)) {
        const type = validationResult.type as FileType; // Forzar el tipo a 'FileType'
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
        toast.error('Nombre de archivo o tipo de archivo inválido.', { position: 'bottom-right' });
      }
    } else {
      toast.error('Por favor, seleccione un archivo CSV o Excel para subir.', { position: 'bottom-right' });
    }
  }

  /**
   * Validar si el tipo de archivo es válido.
   * @param type Tipo de archivo a validar.
   * @returns boolean
   */
  private isFileTypeValid(type: string): type is FileType {
    return ['socios', 'asistencia'].includes(type);
  }

  /**
   * Validar el nombre del archivo.
   * @param fileName Nombre del archivo.
   * @returns Objeto con isValid, errorType y type.
   */
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

  /**
   * Extraer la fecha del nombre del archivo en formato 'YYYY-MM-DD'.
   * @param fileName Nombre del archivo.
   * @returns Fecha extraída como string.
   */
  private extractDateFromFileName(fileName: string): string {
    const regex = /\d{4}-\d{2}-\d{2}/;
    const match = fileName.match(regex);
    if (match) {
      return match[0]; // Devolver la fecha encontrada en el nombre del archivo
    }
    throw new Error('El archivo no tiene una fecha válida en el nombre.');
  }

  /**
   * Obtener la extensión del archivo.
   * @param fileName Nombre del archivo.
   * @returns Extensión del archivo.
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || '';
  }

  /**
   * Parsear archivo CSV.
   * @param file Archivo a parsear.
   * @param type Tipo de archivo ('socios' o 'asistencia').
   * @param extractedDate Fecha extraída del nombre del archivo.
   */
  private parseCsvFile(file: File, type: FileType, extractedDate: string): void {
    this.papa.parse(file, {
      header: true,
      complete: (result: ParseResult<Record<string, string>[]>) => {
        const data = result.data;
        if (data.length > 0) {
          const headers = Object.keys(data[0]);
          this.handleParsedData(headers, data, type, extractedDate);
        } else {
          toast.error('El archivo CSV está vacío.', { position: 'bottom-right' });
        }
      },
      error: (error: Error) => {
        toast.error(`Error al analizar el archivo CSV: ${error.message}`, { position: 'bottom-right' });
      },
    });
  }
  /**
   * Parsear archivo Excel.
   * @param file Archivo a parsear.
   * @param type Tipo de archivo ('socios' o 'asistencia').
   * @param extractedDate Fecha extraída del nombre del archivo.
   */
  private parseExcelFile(file: File, type: FileType, extractedDate: string): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as Record<string, string>[];

      this.handleParsedData(headers, rows, type, extractedDate);
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * Manejar los datos parseados de CSV o Excel.
   * @param headers Cabeceras del archivo.
   * @param data Datos parseados del archivo.
   * @param type Tipo de archivo ('socios' o 'asistencia').
   * @param extractedDate Fecha extraída del nombre del archivo.
   */
  private handleParsedData(
    headers: string[],
    data: Record<string, string>[],
    type: FileType,
    extractedDate: string,
  ): void {
    if (this.validateHeaders(headers, type)) {
      const mappedData = this.mapHeaders(data, type, extractedDate);
      this.uploadToServer(mappedData, type);
    } else {
      toast.error('Las cabeceras del archivo no coinciden con el formato esperado.', { position: 'bottom-right' });
    }
  }

  /**
   * Validar que las cabeceras del archivo coincidan con las esperadas.
   * @param headers Cabeceras del archivo.
   * @param type Tipo de archivo ('socios' o 'asistencia').
   * @returns Verdadero si las cabeceras son válidas, falso si no.
   */
  private validateHeaders(headers: string[], type: 'socios' | 'asistencia'): boolean {
    const expectedHeaders = this.expectedHeaders[type];
    return expectedHeaders.every((header) => headers.includes(header));
  }

  /**
   * Convertir filas de Excel a formato JSON.
   * @param headers Cabeceras del archivo.
   * @param rows Filas de datos.
   * @returns Array de objetos con los datos mapeados.
   */
  private mapRowsToJson(headers: string[], rows: string[][]): Array<Record<string, string>> {
    return rows.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  /**
   * Mapear cabeceras de los archivos a las que necesita el servidor.
   * @param data Datos del archivo.
   * @param type Tipo de archivo ('socios' o 'asistencia').
   * @param extractedDate Fecha extraída del nombre del archivo.
   * @returns Array de datos mapeados.
   */
  private mapHeaders(data: Array<Record<string, string>>, type: string, extractedDate: string): MappedData[] {
    return data
      .map((item) => {
        let entryTime: string;

        // Si HORA_ENTRADA es válido, lo formateamos; de lo contrario, usamos '99:99:99'
        if (item['HORA_ENTRADA']) {
          entryTime = UtilsService.formatEntryDateTime(item['HORA_ENTRADA']);
        } else {
          entryTime = `${extractedDate} 99:99:99`; // Añadir el día normal y poner la hora a 99:99:99
        }

        // Asegurarse de que todos los campos importantes son strings o establecer valores por defecto
        const mappedData: MappedData = {
          memberNumber: item['NUM_SOCIO'] ? String(item['NUM_SOCIO']) : '99999', // Por defecto "99999" si está indefinido
          dni: item['DNI'] ? String(item['DNI']).trim() : 'undefined', // Asegurarse de que es un string y recortar espacios
          email: item['EMAIL'] ? String(item['EMAIL']) : 'undefined@undefined.undefined', // Email por defecto
          name: item['NOMBRE'] ? String(item['NOMBRE']) : 'undefined', // Nombre por defecto
          entry: entryTime,
          date: extractedDate, // Fecha extraída del nombre del archivo
        };

        // Retornar null para filas donde todos los campos importantes están indefinidos
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
      .filter((item): item is MappedData => item !== null); // Eliminar valores nulos del array final
  }

  /**
   * Método reutilizable para enviar solicitudes HTTP POST.
   * @param endpoint URL del endpoint.
   * @param data Datos a enviar.
   */
  private sendPostRequest(endpoint: string, data: MappedData[]): void {
    this.http.post(endpoint, data, { withCredentials: true }).subscribe({
      next: (response) => {
        toast.success('Operación completada con éxito.', { position: 'bottom-right' });
        console.log('Response:', response); // Para propósitos de depuración
        this.close(); // Cerrar el modal después del éxito
      },
      error: (error) => {
        const errorMsg = error?.message || 'Error desconocido al procesar la solicitud.';
        toast.error(`Error al subir el archivo: ${errorMsg}`, { position: 'bottom-right' });
        console.error('Error:', error); // Para propósitos de depuración
      },
    });
  }

  /**
   * Subir los datos al servidor.
   * @param jsonData Datos a enviar.
   * @param type Tipo de archivo ('socios' o 'asistencia').
   */
  private uploadToServer(jsonData: MappedData[], type: string): void {
    const endpoint = type === 'socios' ? `${this.apiUrl}/socios/import` : `${this.apiUrl}/attendance/create`;
    console.log('Uploading data:', jsonData); // Para propósitos de depuración

    // Llamar al método reutilizable para hacer el POST
    this.sendPostRequest(endpoint, jsonData);
  }
}
