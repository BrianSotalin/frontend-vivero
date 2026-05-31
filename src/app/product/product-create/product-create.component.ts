import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductFormComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  nuevoProducto = {
    producto: '',
    categoria: '',
    precioCompra: 0,
    precioVenta: 0
  };

  guardar(formulario: NgForm) {
    if (formulario.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Por favor, rellena todos los campos correctamente.' });
      return;
    }
    this.productService.createProducto(this.nuevoProducto).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado con éxito.' });
        setTimeout(() => this.router.navigate(['/productos']), 1500);
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          const mensajes = Object.values(err.error).join(', ');
          this.messageService.add({ severity: 'error', summary: 'Error de validación', detail: mensajes });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado al guardar el producto.' });
        }
      }
    });
  }
}