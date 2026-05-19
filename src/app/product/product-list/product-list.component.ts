import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  productos = signal<any[]>([]);
  // Guardamos temporalmente el producto que se planea eliminar
  productoSeleccionado = signal<any>(null);

  // --- ESTADO DE PAGINACIÓN ---
  paginaActual = signal<number>(1);
  productosPorPagina = signal<number>(5); // Por defecto inicializa en 5

  // --- LÓGICA REACTIVA (COMPUTED) ---
  // Calcula el total de páginas necesarias
  totalPaginas = computed(() => {
    return Math.ceil(this.productos().length / this.productosPorPagina());
  });

  // Filtra y corta la lista original para devolver solo los productos de la página activa
  productosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.productosPorPagina();
    const fin = inicio + this.productosPorPagina();
    return this.productos().slice(inicio, fin);
  });

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
  // Métodos para cambiar de página
  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }

  // Al cambiar el tamaño (5, 10, 20), reiniciamos a la página 1 para evitar desbordamientos
  cambiarTamano() {
    this.paginaActual.set(1);
  }
}