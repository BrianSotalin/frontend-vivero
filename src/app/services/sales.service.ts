import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/ventas';

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}