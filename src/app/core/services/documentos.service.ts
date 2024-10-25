import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, forkJoin } from 'rxjs';
import { catchError, tap, map, mergeMap } from 'rxjs/operators';
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
   * Obtener medios desde la API de WordPress con caché en memoria y manejar paginación.
   */
  getMedia(tipo: string): Observable<WPMedia[]> {
    const params = new HttpParams().set('mime_type', tipo).set('per_page', '100'); // Límite alto para obtener más resultados por página

    // Hacer la primera solicitud para obtener los resultados iniciales y los headers de paginación
    return this.http.get<WPMedia[]>(this.apiUrl, { params, observe: 'response' }).pipe(
      mergeMap((response) => {
        const totalPages = Number(response.headers.get('X-WP-TotalPages')) || 1; // Obtener el número total de páginas
        const initialMedia = response.body || [];

        if (totalPages === 1) {
          // Si solo hay una página, devolver los resultados
          return of(initialMedia);
        } else {
          // Si hay más de una página, hacer solicitudes adicionales para las otras páginas
          const pageRequests: Observable<WPMedia[]>[] = [];

          for (let page = 2; page <= totalPages; page++) {
            const paginatedParams = params.set('page', page.toString());
            pageRequests.push(this.http.get<WPMedia[]>(this.apiUrl, { params: paginatedParams }));
          }

          // Usar forkJoin para hacer todas las solicitudes de las páginas restantes
          return forkJoin(pageRequests).pipe(
            map((responses) => {
              // Combinar los resultados de todas las páginas en un solo array
              const allMedia = responses.reduce((acc, mediaPage) => acc.concat(mediaPage), initialMedia);
              return allMedia;
            }),
          );
        }
      }),
      catchError(this.handleError),
    );
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
    const params = new HttpParams().set('socioId', socioId.toString());
    return this.http.get<WPMedia[]>(this.apiUrl, { params });
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
