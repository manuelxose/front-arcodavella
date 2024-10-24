import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(user: User): Observable<{ profile: User }> {
    return this.http.get<{ profile: User }>(`${this.apiUrl}/profile/${user.id}`, { withCredentials: true });
  }

  updateUserProfile(user: User): Observable<{ profile: User }> {
    return this.http.put<{ profile: User }>(`${this.apiUrl}/profile/${user.id}`, { user }, { withCredentials: true });
  }

  // Buscar el perfil del usuario por su email
  getUserProfileByEmail(email: string): Observable<{ profile: User }> {
    return this.http.get<{ profile: User }>(`${this.apiUrl}/auth?email=${email}`, { withCredentials: true });
  }
}
