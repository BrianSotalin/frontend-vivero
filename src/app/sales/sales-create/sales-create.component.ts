import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ProductService } from '../../services/product.service';
import { ClientService } from '../../services/client.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-sales-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    ToastModule,
    CardModule,
    DividerModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule
  ],
  providers: [MessageService],
  templateUrl: './sales-create.component.html',
  styleUrls: ['./sales-create.component.css']
})
export class SalesCreateComponent implements OnInit {
  private salesService = inject(SalesService);
  private productService = inject(ProductService);
  private clienteService = inject(ClientService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  productos = signal<any[]>([]);
  clientes = signal<any[]>([]);
  clienteSeleccionadoId = signal<number | null>(null);
  carrito = signal<any[]>([]);
  fechaSeleccionada: Date = new Date();

  precioModificable: number = 0;
  productoSeleccionado: any = null;
  cantidadAgregar: number = 1;
  estadoPagoSeleccionado: number = 0;
  montoAbonado: number = 0;

  estadosPago = [
    { label: 'PAGADA (Monto completo recibido)', value: 0 },
    { label: 'DEUDA (Por cobrar / Crédito)', value: 1 },
    { label: 'ABONADO (Pago parcial)', value: 2 },
  ];

  ngOnInit() {
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error cargando productos', err)
    });
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error cargando clientes', err)
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
    const itemExistente = carritoActual.find(item =>
      item.producto.id === this.productoSeleccionado.id && item.precio === this.precioModificable
    );

    if (itemExistente) {
      itemExistente.cantidad += this.cantidadAgregar;
      this.carrito.set(carritoActual);
    } else {
      this.carrito.set([...this.carrito(), {
        producto: { id: this.productoSeleccionado.id, nombre: this.productoSeleccionado.producto },
        precio: this.precioModificable,
        cantidad: this.cantidadAgregar
      }]);
    }

    this.productoSeleccionado = null;
    this.cantidadAgregar = 1;
    this.precioModificable = 0;
  }

  eliminarDelCarrito(index: number) {
    this.carrito.set(this.carrito().filter((_, i) => i !== index));
  }

  totalVenta = computed(() =>
    this.carrito().reduce((sum, item) => sum + (item.cantidad * item.precio), 0)
  );

  guardarVenta() {
    if (this.carrito().length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debes agregar al menos un artículo.' });
      return;
    }
    // Usamos el ajuste de zona horaria local para evitar que se mueva de día
    const tzoffset = this.fechaSeleccionada.getTimezoneOffset() * 60000;
    const fechaISO = new Date(this.fechaSeleccionada.getTime() - tzoffset).toISOString().slice(0, 19);

    const payload: any = {
      fecha: fechaISO,
      estado: this.estadoPagoSeleccionado,
      abono: this.estadoPagoSeleccionado === 2 ? this.montoAbonado : 0,
      detalles: this.carrito().map(item => ({
        producto: { id: item.producto.id },
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    if (this.clienteSeleccionadoId()) {
      payload.cliente = { id: Number(this.clienteSeleccionadoId()) };
    }

    this.salesService.createSale(payload).subscribe({
      next: (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Venta registrada. Código: ${res.codigo}` });
        setTimeout(() => this.router.navigate(['/ventas']), 1500);
      },
      error: (err: any) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al registrar la venta.' });
      }
    });
  }
}