import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    IconField,
    InputIcon,
    TagModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  productos = signal<any[]>([]);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error cargando productos', err),
    });
  }

  abrirConfirmacion(producto: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas quitar el producto <strong>${producto.producto}</strong> del inventario? Esta acción no se puede deshacer.`,
      header: `Eliminar "${producto.producto}"`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarProducto(producto),
    });
  }

  eliminarProducto(producto: any) {
    this.productService.deleteProducto(producto.id).subscribe({
      next: () => {
        this.cargarProductos();
        this.messageService.add({
          severity: 'success',
          summary: 'Producto eliminado',
          detail: `${producto.producto} fue eliminado con éxito.`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar el producto.',
        });
      },
    });
  }
}