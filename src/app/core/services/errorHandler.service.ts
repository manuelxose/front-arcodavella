import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  // Manejo de errores HTTP y otros errores comunes
  handleHttpError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error.error instanceof ErrorEvent) {
      // Errores del lado del cliente o de la red
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Errores del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta (400). Verifica los datos enviados.';
          break;
        case 401:
          errorMessage = 'No autorizado (401). Debes iniciar sesión.';
          break;
        case 403:
          errorMessage = 'Prohibido (403). No tienes permisos para realizar esta acción.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado (404).';
          break;
        case 500:
          errorMessage = 'Error interno del servidor (500).';
          break;
        default:
          errorMessage = `Error: ${error.status}. ${error.message}`;
      }
    }

    // Mostrar mensaje de error con toast
    toast.error(errorMessage, {
      position: 'bottom-right',
    });

    console.error('Error:', errorMessage);
  }

  // Manejo de errores comunes en el procesamiento de datos
  handleGeneralError(error: any): void {
    let errorMessage = 'Ocurrió un error inesperado.';

    if (error instanceof SyntaxError) {
      errorMessage = 'Error al procesar el código QR: Datos no válidos.';
    } else if (error instanceof TypeError) {
      errorMessage = 'Error de tipo: Se intentó acceder a un dato incorrecto.';
    } else {
      errorMessage = `Error no controlado: ${error.message}`;
    }

    // Mostrar el error con un toast
    toast.error(errorMessage, {
      position: 'bottom-right',
    });

    console.error('Error:', errorMessage);
  }
}
