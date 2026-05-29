import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

updateUserAndPass(id: number, nuevoRol: string, nuevaPassword: string): Observable<any> {
  // 1. Creamos el objeto JSON tal y como lo espera tu backend
  const body = {
    rol: nuevoRol,
    password: nuevaPassword
  };

  // 2. Enviamos el objeto 'body' como segundo parámetro (sin HttpParams)
  return this.http.patch<any>(`${this.apiUrl}/${id}`, body); 
}

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}