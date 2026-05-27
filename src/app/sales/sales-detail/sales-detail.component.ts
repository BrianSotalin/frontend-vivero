import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css'] // Puedes reutilizar estilos globales de tablas
})
export class SalesDetailComponent implements OnInit {
  private salesService = inject(SalesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Signal que almacena el objeto Venta completo (con su cliente y lista de detalles)
  venta = signal<any>(null);
  
    // Resta automáticamente el abono del total protegiendo el código de valores nulos
  saldoPendiente = computed(() => {
    const datosVenta = this.venta();
    if (!datosVenta) return 0;
    
    const total = datosVenta.total || 0;
    const abono = datosVenta.abono || 0;
    return total - abono;
  });

  // Guardamos el ID por si se necesita en alguna otra parte de la lógica
  ventaId: number | null = null;

    // 1. Diccionario para los textos que verá el usuario
  textosEstado: { [key: number]: string } = {
    0: 'PAGADO',
    1: 'DEUDA',
    2: 'ABONADO'
  };

  // 2. Diccionario para las clases CSS de los badges
  clasesEstado: { [key: number]: string } = {
    0: 'status-paid',
    1: 'status-debt',    // Puedes crear una clase intermedia para la deuda
    2: 'status-pending' // O 'status-abonado'
  };

  ngOnInit() {
    // 1. Capturamos el ID de la venta desde el parámetro de la ruta activa
    this.ventaId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.ventaId) {
      this.obtenerDetalleVenta(this.ventaId);
    } else {
      console.error('No se proporcionó un ID de venta válido en la URL');
      this.router.navigate(['/ventas']);
    }
  }

  /**
   * Se comunica con el servicio para recuperar la venta con todas sus ramificaciones
   * @param id Identificador único de la venta
   */
obtenerDetalleVenta(id: number) {
    // Ahora coincide perfectamente con getSalesById
    this.salesService.getSalesById(id).subscribe({
      next: (data: any) => { // Agregado ': any'
        console.log('Datos de la venta recuperados con éxito:', data);
        this.venta.set(data);
        this.cdr.detectChanges();
      },
      error: (err: any) => { //  Agregado ': any'
        console.error('Error al intentar cargar el detalle de la venta:', err);
        alert('Ocurrió un error al cargar los datos.');
        this.router.navigate(['/ventas']);
      }
    });
  }
}