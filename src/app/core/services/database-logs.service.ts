// Servicio para obtener los logs de la base de datos

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Log {
  email: string;
  id: string;
  ipAddress: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseLogsService {
  private apiUrl = `${environment.apiUrl}/log`; // Cambia esto según tu API

  constructor(private http: HttpClient) {}

  getLogs(): Observable<Log[]> {
    return this.http.get<Log[]>(this.apiUrl + '/all', { withCredentials: true });
  }
}
