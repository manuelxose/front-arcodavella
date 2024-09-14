import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilsService } from 'src/app/shared/utils/transformDate';

export interface AttendanceResponse {
  dates: string[]; // Array de fechas en formato ISO
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl = `${environment.apiUrl}/attendance`; // URL base para las peticiones de asistencia

  constructor(private http: HttpClient) {}

  // Obtener fechas distintas de asistencia de la API y devolverlas formateadas
  getAttendanceDates(year: number): Observable<string[]> {
    return this.http.get<AttendanceResponse>(`${this.apiUrl}/distinct-dates`, { withCredentials: true }).pipe(
      map((response) => {
        // Formatear las fechas antes de enviarlas
        return response.dates.map((date) => UtilsService.formatDateToReadableString(date));
      }),
      catchError((error) => {
        console.error('Error al obtener las fechas de asistencia:', error);
        return of([]); // Devolver un array vacío en caso de error
      }),
    );
  }

  // Obtener asistencias por fecha
  getAttendanceByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-date/${date}`, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al obtener las asistencias por fecha:', error);
        return of([]); // Devolver un array vacío en caso de error
      }),
    );
  }

  editAttendance(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al editar la asistencia:', error);
        return of(null as any); // Devolver null en caso de error
      }),
    );
  }

  // Crear nueva asistencia
  createAttendance(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, user, { withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error al crear la asistencia:', error);
        return of(null as any); // Devolver null en caso de error
      }),
    );
  }
}
