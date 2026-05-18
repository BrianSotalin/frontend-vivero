import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  productos = signal<any[]>([]);
  // Guardamos temporalmente el producto que se planea eliminar
  productoSeleccionado = signal<any>(null);

  ngOnInit() {
    this.cargarProductos();
  }
  cargarProductos() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error cargando productos', err)
    });
  }
  // Abre el modal guardando el producto seleccionado
  abrirConfirmacion(producto: any, modal: HTMLDialogElement) {
    this.productoSeleccionado.set(producto);
    modal.showModal(); // Método nativo del navegador para mostrar modales
  }

  // Cierra el modal y limpia la selección
  cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.productoSeleccionado.set(null);
  }

  // Confirma la eliminación en el servidor
  confirmarEliminar(modal: HTMLDialogElement) {
    const prod = this.productoSeleccionado();
    if (prod) {
      this.productService.deleteProducto(prod.id).subscribe({
        next: () => {
          this.cerrarModal(modal);
          this.cargarProductos(); // Recarga la tabla automáticamente
           alert('Producto eliminado con éxito! ');
        },
        error: (err) => {
          console.error('Error al eliminar el producto', err);
          alert(`No se pudo eliminar el producto : ${err.error?.message || err.message}`);
        }
      });
    }
  }
}