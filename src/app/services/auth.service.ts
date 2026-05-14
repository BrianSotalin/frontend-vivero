import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';
  private router = inject(Router);

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    // credentials debe ser { username: '...', password: '...' }
    return this.http.post(this.apiUrl, credentials);
  }
  logout() {
    localStorage.removeItem('token'); // Limpiamos el JWT
    localStorage.removeItem('username'); // Limpiamos el nombre si lo guardaste
    this.router.navigate(['/login']);
  }
}