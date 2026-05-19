import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
getProductoById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`);
}

  // En src/app/services/product.service.ts
createProducto(producto: any): Observable<any> {
  return this.http.post(this.apiUrl, producto);
}

updateProducto(id: number, producto: any): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}`, producto);
}
// En src/app/services/product.service.ts
deleteProducto(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}