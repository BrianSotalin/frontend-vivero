import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  private productService = inject(ProductService);
  private router = inject(Router);

  nuevoProducto = {
    producto: '',
    categoria: '',
    precioCompra: 0,
    precioVenta: 0
  };

  guardar() {
    this.productService.createProducto(this.nuevoProducto).subscribe({
      next: () => {
        alert('Producto creado con éxito! 🌿');
        this.router.navigate(['/productos']);
      },
      error: (err) => console.error('Error al crear:', err)
    });
  }
}