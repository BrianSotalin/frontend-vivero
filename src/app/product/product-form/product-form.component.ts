import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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

  guardar(formulario: NgForm) {
    // Doble seguridad: Si el formulario es inválido, mostramos un aviso y no hacemos el POST
    if (formulario.invalid) {
      alert('Por favor, rellena todos los campos correctamente.');
      return; 
    }
    this.productService.createProducto(this.nuevoProducto).subscribe({
      next: () => {
        alert('Producto creado con éxito! 🌿');
        this.router.navigate(['/productos']);
      },
     error: (err) => {
      console.error('Error completo del servidor:', err);

      // Si el backend devuelve un 400 (Bad Request), procesamos los mensajes de validación
      if (err.status === 400 && err.error) {
        // Como el GlobalExceptionHandler de Java devuelve un mapa { campo: mensaje }, 
        // podemos extraer todos los mensajes de error y juntarlos
        const mensajesDeError = Object.values(err.error).join('\n');
        alert(`Error de validación:\n${mensajesDeError}`);
      } else {
        // Error genérico por si se cae el servidor o hay un problema de red
        alert('Ocurrió un error inesperado al guardar el producto.');
      }
    }
    });
  }
}