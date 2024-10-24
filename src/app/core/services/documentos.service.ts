// src/app/services/documentos.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WPMedia } from '../models/wp.model';

export interface Documento {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private apiUrl = 'https://arcodavella.gal/wp-json/wp/v2/media'; // Endpoint de la API

  // Caché en memoria
  private mediaCache: Documento[] = [];

  constructor(private http: HttpClient) {}

  /**
   * Obtener medios desde la API de WordPress con caché en memoria.
   */
  getMedia(tipo: string): Observable<WPMedia[]> {
    // Implementa la lógica para obtener documentos generales
    return this.http.get<WPMedia[]>(`${this.apiUrl}?tipo=${tipo}`);
  }

  /**
   * Subir un nuevo documento.
   * En una aplicación real, deberías enviar el archivo al servidor.
   */
  uploadDocument(file: File): Observable<Documento> {
    // Simular la subida de documento
    const reader = new FileReader();
    return new Observable<Documento>((observer) => {
      reader.onload = () => {
        const documento: Documento = {
          name: file.name,
          url: reader.result as string,
        };
        this.mediaCache.push(documento);
        observer.next(documento);
        observer.complete();
      };
      reader.onerror = (error) => {
        observer.error(error);
      };
      reader.readAsDataURL(file);
    });
  }

  getDocumentosSocio(socioId: number): Observable<WPMedia[]> {
    // Implementa la lógica para obtener documentos de un socio específico
    return this.http.get<WPMedia[]>(`${this.apiUrl}?socioId=${socioId}`);
  }

  /**
   * Eliminar un documento.
   * En una aplicación real, deberías enviar una solicitud al servidor para eliminar el archivo.
   */
  deleteDocument(documentName: string): Observable<boolean> {
    const index = this.mediaCache.findIndex((doc) => doc.name === documentName);
    if (index !== -1) {
      this.mediaCache.splice(index, 1);
      return of(true);
    } else {
      return of(false);
    }
  }

  /**
   * Manejo de errores HTTP.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Error en la API de Documentos:', error);
    return throwError(() => new Error('Error al gestionar los documentos.'));
  }
}
