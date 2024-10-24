// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie.utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient) {
    const userData = getCookie('user');
    console.log('AuthService initialized. User data from cookies:', userData);

    this.userSubject = new BehaviorSubject<User | null>(userData ? JSON.parse(userData) : null);
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  /**
   * Inicia sesión del usuario.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable con los datos del usuario.
   */
  login(email: string, password: string): Observable<User> {
    console.log('Attempting to log in with email:', email);

    return this.http
      .post<User>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true }) // 'withCredentials' para enviar y recibir cookies
      .pipe(
        tap((user) => this.handleAuthentication(user)),
        catchError(this.handleError),
      );
  }

  /**
   * Registra un nuevo usuario.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable con los datos del usuario.
   */
  register(email: string, password: string): Observable<User> {
    console.log('Attempting to register with email:', email);

    return this.http.post<User>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      tap((user) => this.handleAuthentication(user)),
      catchError(this.handleError),
    );
  }

  /**
   * Solicita un restablecimiento de contraseña.
   * @param email Correo electrónico del usuario.
   * @returns Observable vacío.
   */
  forgotPassword(email: string): Observable<void> {
    console.log('Requesting password reset link for email:', email);

    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password`, { email }).pipe(
      tap(() => {
        console.log('Password reset link sent successfully to:', email);
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Restablece la contraseña del usuario.
   * @param token Token de restablecimiento.
   * @param newPassword Nueva contraseña.
   * @returns Observable vacío.
   */
  resetPassword(token: string, newPassword: string): Observable<void> {
    console.log('Attempting to reset password with token:', token);

    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, { token, newPassword }).pipe(
      tap(() => {
        console.log('Password reset successful.');
      }),
      catchError(this.handleError),
    );
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    console.log('Logging out. Clearing user data.');
    deleteCookie('user');
    deleteCookie('access-token'); // Asegúrate de que el backend también elimine el token si es httpOnly
    this.userSubject.next(null);
  }

  /**
   * Verifica si el usuario está autenticado.
   * @returns Booleano indicando si está autenticado.
   */
  isAuthenticated(): boolean {
    const isAuthenticated = !!this.userValue;
    console.log('Check if user is authenticated:', isAuthenticated);
    return isAuthenticated;
  }

  /**
   * Maneja la autenticación tras un inicio de sesión o registro exitoso.
   * @param user Datos del usuario.
   */
  private handleAuthentication(user: User): void {
    console.log('Login/Registration successful. User received:', user);
    setCookie('user', JSON.stringify(user), 7); // Guarda los datos del usuario en una cookie
    this.userSubject.next(user);
  }

  /**
   * Actualiza los datos del usuario en el servicio.
   * @param user Datos actualizados del usuario.
   */
  updateUserValue(user: User): void {
    console.log('User data updated:', user);
    setCookie('user', JSON.stringify(user), 7); // Actualiza la cookie con los nuevos datos
    this.userSubject.next(user);
  }

  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param error Error recibido.
   * @returns Observable con el error.
   */
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }

  /**
   * Obtiene los datos del usuario actual desde el backend.
   * Esto es útil para sincronizar el estado del usuario al recargar la página.
   * @returns Observable con los datos del usuario.
   */
  fetchCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`, { withCredentials: true }).pipe(
      tap((user) => {
        console.log('Fetched current user:', user);
        this.handleAuthentication(user);
      }),
      catchError((error) => {
        console.error('Error fetching current user:', error);
        this.logout(); // Opcional: Cierra sesión si hay un error al obtener el usuario
        return throwError(() => new Error('Error fetching user data'));
      }),
    );
  }
}
