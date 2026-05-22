import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';


@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-edit.component.html', // Reutilizaremos el diseño del otro
  styleUrls: ['./product-edit.component.css']    // Reutilizamos el mismo CSS
})
export class ProductEditComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  productoId!: number;
  datosOriginales: any;

productoEnEdicion = {
  producto: '',
  categoria: '',
  precioCompra: 0,
  precioVenta: 0
};
  ngOnInit() {
    // 1. Obtenemos el ID de la ruta /productos/editar/5
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    
    // 2. Cargamos los datos actuales del producto
    this.productService.getProductoById(this.productoId).subscribe({
next: (data) => {
    this.productoEnEdicion = data;
    this.datosOriginales = { ...data }; // Guardamos una copia exacta de cómo vino de la BD
    this.cdr.detectChanges();
  },
      error: (err) => {
        console.error('❌ Error crítico al llamar al servicio:', err);
        console.error('Error al cargar producto', err);
        alert('No se pudo encontrar el producto.');
        this.router.navigate(['/productos']);
      }
    });
  }

  actualizar(formulario: NgForm) {
 if (formulario.invalid) return;

  // Creamos un objeto vacío donde solo meteremos lo que cambió
  const camposModificados: any = {};

  // Comparamos campo por campo
  if (this.productoEnEdicion.producto !== this.datosOriginales.producto) {
    camposModificados.producto = this.productoEnEdicion.producto;
  }
  if (this.productoEnEdicion.categoria !== this.datosOriginales.categoria) {
    camposModificados.categoria = this.productoEnEdicion.categoria;
  }
  if (this.productoEnEdicion.precioCompra !== this.datosOriginales.precioCompra) {
    camposModificados.precioCompra = this.productoEnEdicion.precioCompra;
  }
  if (this.productoEnEdicion.precioVenta !== this.datosOriginales.precioVenta) {
    camposModificados.precioVenta = this.productoEnEdicion.precioVenta;
  }

  // Si el usuario no cambió absolutamente nada, no molestamos al servidor
  if (Object.keys(camposModificados).length === 0) {
    alert('No has realizado ningún cambio.');
    this.router.navigate(['/productos']);
    return;
  }

  // Enviamos al PATCH únicamente el trozo modificado
  this.productService.updateProducto(this.productoId, camposModificados).subscribe({
    next: () => {
      alert('Producto actualizado con éxito!');
      this.router.navigate(['/productos']);
    },
    error: (err) => {
      console.error('Error completo:', err);
      alert(`Error al actualizar el producto: ${err.message}${err.error ? ' - ' + JSON.stringify(err.error) : ''}`);
    }
  });
  }
}