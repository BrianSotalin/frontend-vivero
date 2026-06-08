import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ProductService } from '../../services/product.service';
import { ClientService } from '../../services/client.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-sales-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    ToastModule,
    CardModule,
    DividerModule,
    TagModule,
    DatePickerModule,
  ],
  providers: [MessageService],
  templateUrl: './sales-edit.component.html',
  styleUrls: ['./sales-edit.component.css'],
})
export class SalesEditComponent implements OnInit {
  private salesService = inject(SalesService);
  private productService = inject(ProductService);
  private clienteService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  ventaId = signal<number>(0);
  venta = signal<any>(null);
  productos = signal<any[]>([]);
  clientes = signal<any[]>([]);

  // Encabezado
  clienteSeleccionadoId: number | null = null;
  fechaSeleccionada: Date = new Date();

  // Carrito
  carrito = signal<any[]>([]);

  // Item a agregar
  productoSeleccionado: any = null;
  cantidadAgregar: number = 1;
  precioModificable: number = 0;
 
  estadoSeleccionado: number = 0;
  montoAbonado: number = 0;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ventaId.set(id);
    this.cargarCatalogos();
    this.cargarVenta(id);
  }

  cargarCatalogos() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error cargando productos', err),
    });
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error cargando clientes', err),
    });
  }

  cargarVenta(id: number) {
    this.salesService.getSalesById(id).subscribe({
      next: (data) => {
        this.venta.set(data);
        this.clienteSeleccionadoId = data.cliente?.id ?? null;
        this.estadoSeleccionado = data.estado;
        this.montoAbonado = data.abono ?? 0;
        // Ajustamos la fecha para mostrarla correctamente en el datepicker
        if (data.fecha) {
          this.fechaSeleccionada = new Date(data.fecha);
        }
        // Cargamos los detalles existentes en el carrito
        this.carrito.set(
          data.detalles.map((d: any) => ({
            producto: { id: d.producto.id, nombre: d.producto.producto },
            cantidad: d.cantidad,
            precio: d.precio,
          }))
        );
      },
      error: (err) => console.error('Error cargando venta', err),
    });
  }

  onProductoChange(producto: any) {
    if (producto) {
      this.productoSeleccionado = producto;
      this.precioModificable = producto.precioVenta;
    } else {
      this.precioModificable = 0;
    }
  }

  agregarAlCarrito() {
    if (!this.productoSeleccionado) return;
    if (this.cantidadAgregar <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'La cantidad debe ser mayor a 0' });
      return;
    }
    if (this.precioModificable < 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'El precio no puede ser negativo' });
      return;
    }

    const carritoActual = [...this.carrito()];
    const itemExistente = carritoActual.find(
      (item) => item.producto.id === this.productoSeleccionado.id && item.precio === this.precioModificable
    );

    if (itemExistente) {
      itemExistente.cantidad += this.cantidadAgregar;
      this.carrito.set(carritoActual);
    } else {
      this.carrito.set([
        ...this.carrito(),
        {
          producto: { id: this.productoSeleccionado.id, nombre: this.productoSeleccionado.producto },
          precio: this.precioModificable,
          cantidad: this.cantidadAgregar,
        },
      ]);
    }

    this.productoSeleccionado = null;
    this.cantidadAgregar = 1;
    this.precioModificable = 0;
  }

  eliminarDelCarrito(index: number) {
    this.carrito.set(this.carrito().filter((_, i) => i !== index));
  }

  totalVenta = computed(() =>
    this.carrito().reduce((sum, item) => sum + item.cantidad * item.precio, 0)
  );

  guardarCambios() {
    if (this.carrito().length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes agregar al menos un artículo.' });
      return;
    }

    const offset = this.fechaSeleccionada.getTimezoneOffset() * 60000;
    const fechaISO = new Date(this.fechaSeleccionada.getTime() - offset).toISOString().slice(0, 19);

    const payload: any = {
      fecha: fechaISO,
      estado: this.estadoSeleccionado,
      abono: this.estadoSeleccionado === 2 ? this.montoAbonado : 0,
      detalles: this.carrito().map((item) => ({
      producto: { id: item.producto.id },
      cantidad: item.cantidad,
      precio: item.precio,
    })),
};

    if (this.clienteSeleccionadoId) {
      payload.cliente = { id: Number(this.clienteSeleccionadoId) };
    }

    this.salesService.updateSale(this.ventaId(), payload).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Venta actualizada correctamente.' });
        setTimeout(() => this.router.navigate(['/ventas']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'No se pudo actualizar la venta.' });
      },
    });
  }
}