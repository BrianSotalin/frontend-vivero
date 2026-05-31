import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  cargando = signal<boolean>(true);

  productoId!: number;
  datosOriginales: any;

  productoEnEdicion = {
    producto: '',
    categoria: '',
    precioCompra: 0,
    precioVenta: 0
  };

  ngOnInit() {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProductoById(this.productoId).subscribe({
      next: (data) => {
        this.productoEnEdicion = data;
        this.datosOriginales = { ...data };
        this.cargando.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo encontrar el producto.' });
        setTimeout(() => this.router.navigate(['/productos']), 1500);
      }
    });
  }

  actualizar(formulario: NgForm) {
    if (formulario.invalid) return;

    const camposModificados: any = {};

    if (this.productoEnEdicion.producto !== this.datosOriginales.producto)
      camposModificados.producto = this.productoEnEdicion.producto;
    if (this.productoEnEdicion.categoria !== this.datosOriginales.categoria)
      camposModificados.categoria = this.productoEnEdicion.categoria;
    if (this.productoEnEdicion.precioCompra !== this.datosOriginales.precioCompra)
      camposModificados.precioCompra = this.productoEnEdicion.precioCompra;
    if (this.productoEnEdicion.precioVenta !== this.datosOriginales.precioVenta)
      camposModificados.precioVenta = this.productoEnEdicion.precioVenta;

    if (Object.keys(camposModificados).length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sin cambios', detail: 'No has realizado ningún cambio.' });
      setTimeout(() => this.router.navigate(['/productos']), 1500);
      return;
    }

    this.productService.updateProducto(this.productoId, camposModificados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado con éxito.' });
        setTimeout(() => this.router.navigate(['/productos']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al actualizar el producto.' });
      }
    });
  }
}