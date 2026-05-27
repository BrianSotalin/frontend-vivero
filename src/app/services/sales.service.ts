import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ventas';

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // Obtener una venta específica con sus detalles por ID
  getSalesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  createSale(saleData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, saleData);
  }
}