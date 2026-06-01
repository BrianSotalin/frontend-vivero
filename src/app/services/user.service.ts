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
  const body: any = {};

  if (nuevoRol && nuevoRol.trim() !== '') {
    body.rol = nuevoRol;
  }

  if (nuevaPassword && nuevaPassword.trim() !== '') {
    body.password = nuevaPassword;
  }

  return this.http.patch<any>(`${this.apiUrl}/${id}`, body);
}

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}