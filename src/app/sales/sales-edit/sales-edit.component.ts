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
import { forkJoin } from 'rxjs';

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

  // Aseguramos que los catálogos existan antes de pintar la venta
  forkJoin({
    productos: this.productService.getProductos(),
    clientes: this.clienteService.getClientes()
  }).subscribe({
    next: (res) => {
      this.productos.set(res.productos);
      this.clientes.set(res.clientes);
      this.cargarVenta(id); // Ahora ya existen los productos en el signal
    }
  });
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
      this.clienteSeleccionadoId = data.clienteId;
      this.estadoSeleccionado = data.estado;
      this.montoAbonado = data.abono ?? 0;
      
      if (data.fecha) {
        this.fechaSeleccionada = new Date(data.fecha);
      }

      // Ahora productos() ya tiene contenido, el mapeo funcionará
const productosActuales = this.productos(); // Obtenemos el valor actual
      const detallesMapeados = data.detalles.map((d: any) => {
        const prod = productosActuales.find(p => p.id === d.productoId);
        return {
          producto: { 
            id: d.productoId, 
            nombre: prod ? prod.producto : 'No encontrado' 
          },
          cantidad: d.cantidad,
          precio: d.precio,
        };
      });
      
      this.carrito.set(JSON.parse(JSON.stringify(detallesMapeados)));
      
      console.log('Carrito final:', this.carrito());
    }
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
      
      // CORRECCIÓN AQUÍ:
      detalles: this.carrito().map((item) => ({
        productoId: item.producto.id, // Enviar directamente el valor numérico
        cantidad: item.cantidad,
        precio: item.precio,
      })),
    };

    if (this.clienteSeleccionadoId) {
      payload.clienteId = Number(this.clienteSeleccionadoId); 
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