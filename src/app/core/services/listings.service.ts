import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Listing {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListingsService {
  private apiUrl = `${environment.apiUrl}/listings`; // Cambia esto según tu API

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los listados desde el servidor.
   */
  getAllListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/all`, { withCredentials: true });
  }

  /**
   * Crear un nuevo listado.
   */
  createListing(listing: Listing): Observable<Listing> {
    return this.http.post<Listing>(`${this.apiUrl}/create`, listing, { withCredentials: true });
  }

  /**
   * Eliminar un listado por su ID.
   */
  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { withCredentials: true });
  }

  /**
   * Actualizar un listado existente.
   */
  updateListing(id: number, listing: Listing): Observable<Listing> {
    return this.http.put<Listing>(`${this.apiUrl}/update/${id}`, listing, { withCredentials: true });
  }
}
