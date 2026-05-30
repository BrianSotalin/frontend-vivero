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
  private apiUrl = `${environment.apiUrl}/estadisticas`;

getResumen(): Observable<any> {
  return this.http.get(`${this.apiUrl}/resumen`);
}
  getVentasPorMes(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/ventas-por-mes`);
}

getTopProductos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/top-productos`);
}
}