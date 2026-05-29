import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
// 1. Usamos inject() que es el estándar de Angular 18
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/estadisticas/resumen`;

  // 2. El método queda súper simple. 
  // El Interceptor se encargará de "pegar" el token antes de que salga la petición.
  getResumen(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}