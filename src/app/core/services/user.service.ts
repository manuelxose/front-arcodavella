import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../models/member.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(user: Member): Observable<{ profile: Member }> {
    return this.http.get<{ profile: Member }>(`${this.apiUrl}/profile/${user.id}`, { withCredentials: true });
  }

  updateUserProfile(user: Member): Observable<{ profile: Member }> {
    return this.http.put<{ profile: Member }>(`${this.apiUrl}/profile/${user.id}`, { user }, { withCredentials: true });
  }

  // Buscar el perfil del usuario por su email
  getUserProfileByEmail(email: string): Observable<{ profile: Member }> {
    return this.http.get<{ profile: Member }>(`${this.apiUrl}/auth?email=${email}`, { withCredentials: true });
  }
}
