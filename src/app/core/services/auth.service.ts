import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  login(email: string, password: string): Observable<User> {
    console.log('Attempting to log in with email:', email);

    return this.http
      .post<User>(`${this.apiUrl}/auth/login`, { email, password }, { withCredentials: true }) // 'withCredentials' para enviar y recibir cookies
      .pipe(
        tap((user) => this.handleAuthentication(user)),
        catchError(this.handleError),
      );
  }

  register(email: string, password: string): Observable<User> {
    console.log('Attempting to register with email:', email);

    return this.http.post<User>(`${this.apiUrl}/auth/register`, { email, password }).pipe(
      tap((user) => this.handleAuthentication(user)),
      catchError(this.handleError),
    );
  }

  forgotPassword(email: string): Observable<void> {
    console.log('Requesting password reset link for email:', email);

    return this.http.post<void>(`${this.apiUrl}/auth/forgot-password`, { email }).pipe(
      tap(() => {
        console.log('Password reset link sent successfully to:', email);
      }),
      catchError(this.handleError),
    );
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    console.log('Attempting to reset password with token:', token);

    return this.http.post<void>(`${this.apiUrl}/auth/change-password`, { token, newPassword }).pipe(
      tap(() => {
        console.log('Password reset successful.');
      }),
      catchError(this.handleError),
    );
  }

  logout(): void {
    console.log('Logging out. Clearing user data.');
    deleteCookie('user');
    deleteCookie('access-token');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    const isAuthenticated = !!this.userValue;
    console.log('Check if user is authenticated:', isAuthenticated);
    return isAuthenticated;
  }

  private handleAuthentication(user: User): void {
    console.log('Login/Registration successful. User received:', user);
    setCookie('user', JSON.stringify(user), 7);
    this.userSubject.next(user);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Something went wrong'));
  }
}
