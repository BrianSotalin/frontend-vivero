import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ProductService } from '../../services/product.service'; // Ajusta la ruta de tu servicio
import { ClientService } from '../../services/client.service'; // Ajusta la ruta de tu servicio

@Component({
  selector: 'app-sales-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sales-create.component.html',
  styleUrls: ['./sales-create.component.css']
})
export class SalesCreateComponent implements OnInit {
  private salesService = inject(SalesService);
  private productService = inject(ProductService);
  private clienteService = inject(ClientService);
  private router = inject(Router);

  // Catálogos cargados de la base de datos
  productos = signal<any[]>([]);
  clientes = signal<any[]>([]);

  // Selección del encabezado de venta
  clienteSeleccionadoId = signal<number | null>(null);

  // Carrito de compras local (Detalles de la venta)
  carrito = signal<any[]>([]);

  // Variables para el item que se está agregando en el formulario
  precioModificable: number = 0;
  productoSeleccionado: any = null;
  cantidadAgregar: number = 1;

  // Signal para el estado del pago (por defecto 0 = PAGADA)
estadoPagoSeleccionado: number = 0;

// Opcional: Por si quieres guardar cuánto abona si elige la opción 2
montoAbonado: number = 0;

  ngOnInit() {
    this.cargarCatalogos();
  }

  cargarCatalogos() {
    this.productService.getProductos().subscribe({
      next: (data: any[]) => this.productos.set(data),
      error: (err: any) => console.error('Error cargando productos', err)
    });

    this.clienteService.getClientes().subscribe({
      next: (data: any[]) => this.clientes.set(data),
      error: (err: any) => console.error('Error cargando clientes', err)
    });
  }

  // Detecta cuándo cambia el producto seleccionado para cargar su precio base
onProductoChange(producto: any) {
  if (producto) {
    this.productoSeleccionado = producto;
    this.precioModificable = producto.precioVenta; // Cargamos el precio original de la BD
  } else {
    this.precioModificable = 0;
  }
}
  agregarAlCarrito() {
    if (!this.productoSeleccionado) return;
    
    const producto = this.productoSeleccionado;
    const cantidad = this.cantidadAgregar;
    const precioFinal = this.precioModificable;

    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }
    if (precioFinal < 0) {
    alert('El precio no puede ser un valor negativo');
    return;
  }

    // Validar si el producto ya está en el carrito para sumar la cantidad
    const carritoActual = [...this.carrito()];
  // Buscamos si ya existe el producto CON EL MISMO PRECIO en el carrito
  const itemExistente = carritoActual.find(item => 
    item.producto.id === producto.id && item.precio === precioFinal
  );
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      this.carrito.set(carritoActual);
    } else {
      // Estructura exacta que espera tu DetalleVenta de Java
      this.carrito.set([
        ...this.carrito(),
        {
          producto: { id: producto.id, nombre: producto.producto },
          precio: precioFinal, // getPrecioVenta de tu Java
          cantidad: cantidad
        }
      ]);
    }

    // Resetear formulario de inserción rápida
    this.productoSeleccionado = null;
    this.cantidadAgregar = 1;
    this.precioModificable = 0;
  }

  eliminarDelCarrito(index: number) {
    const nuevoCarrito = this.carrito().filter((_, i) => i !== index);
    this.carrito.set(nuevoCarrito);
  }

  // Cálculo del gran total reactivo en el Frontend
  totalVenta = computed(() => {
    return this.carrito().reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
  });

  // Método nuevo para solucionar el error del compilador
cambiarEstadoPago(valor: any) {
  const numeroEstablecido = Number(valor);
  this.estadoPagoSeleccionado = numeroEstablecido;
}
  guardarVenta() {
    if (this.carrito().length === 0) {
      alert('Debes agregar al menos un artículo al carrito.');
      return;
    }

    // Armamos la estructura idéntica a tu Entidad Venta.java
    const payload: any = {
        estado: this.estadoPagoSeleccionado, 
        abono: this.estadoPagoSeleccionado === 2 ? this.montoAbonado : 0,
      detalles: this.carrito().map(item => ({
        producto: { id: item.producto.id },
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    // Si seleccionó un cliente, se mapea el objeto Cliente
    if (this.clienteSeleccionadoId()) {
      payload.cliente = { id: Number(this.clienteSeleccionadoId()) };
    }

    console.log('Enviando payload estructurado a Java:', payload);

    this.salesService.createSale(payload).subscribe({
      next: (res: any) => {
        alert(`¡Venta registrada con éxito! Código generado: ${res.codigo}`);
        this.router.navigate(['/ventas']);
      },
      error: (err: any) => {
        console.error('Error al registrar venta:', err);
        alert('Ocurrió un error en el servidor al intentar procesar la venta.');
      }
    });
  }
}