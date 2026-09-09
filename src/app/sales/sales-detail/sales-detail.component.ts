import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ProductService } from '../../services/product.service';
import { ClientService } from '../../services/client.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sales-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TagModule],
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.css']
})
export class SalesDetailComponent implements OnInit {
  private salesService = inject(SalesService);
  private productService = inject(ProductService); 
  private clienteService = inject(ClientService); // 🎯 Asegúrate de que este servicio sea el correcto si es necesario
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  venta = signal<any>(null);
  nombreCliente = signal<string>('');
  cargandoPdf = signal<boolean>(false);
  
  // 🎯 Inicializado con firma de índice flexible para evitar errores de compilación
  nombresProductos = signal<{ [key: string]: string }>({});

  saldoPendiente = computed(() => {
    const datosVenta = this.venta();
    if (!datosVenta) return 0;
    return (datosVenta.total || 0) - (datosVenta.abono || 0);
  });

  ventaId: number | null = null;

  textosEstado: { [key: number]: string } = {
    0: 'PAGADO',
    1: 'DEUDA',
    2: 'ABONADO'
  };

  severidadEstado: { [key: number]: 'success' | 'danger' | 'warn' } = {
    0: 'success',
    1: 'danger',
    2: 'warn'
  };

  ngOnInit() {
    this.ventaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.ventaId) {
      this.obtenerDetalleVenta(this.ventaId);
    } else {
      this.router.navigate(['/ventas']);
    }
  }

  obtenerDetalleVenta(id: number) {
    this.salesService.getSalesById(id).subscribe({
      next: (data: any) => {
        this.venta.set(data);
        this.cdr.detectChanges();
        
        if(data.clienteId) {
          this.clienteService.getClienteById(data.clienteId).subscribe({
            next: (clienteData: any) => {
              this.nombreCliente.set(clienteData?.nombre || 'Cliente desconocido');
              this.cdr.detectChanges();
            },
            error: (err: any) => {
              console.error('Error al cargar el cliente:', err);
              this.nombreCliente.set('Cliente desconocido');
              this.cdr.detectChanges();
            }
          });
        } 
        //  Si la venta tiene líneas de detalle, disparamos la hidratación
        if (data && data.detalles) {
          this.cargarNombresDeProductos(data.detalles);
        }
      },
      error: (err: any) => {
        console.error('Error al cargar el detalle:', err);
        this.router.navigate(['/ventas']);
      }
    });
  }

  // 🎯 Método robusto para mapear los nombres asíncronamente
  private cargarNombresDeProductos(detalles: any[]) {
    detalles.forEach(item => {
      const pId = item.productoId;
      if (!pId) return;

      // Si el ID ya está en proceso o cargado, no duplicamos llamadas a la API
      if (!this.nombresProductos()[pId.toString()]) {
        this.productService.getProductoById(pId).subscribe({
          next: (prod: any) => {
            if (prod) {
              // Soporta tanto si tu atributo es 'producto' como si es 'nombre'
              const nombreExtraido = prod.producto || prod.nombre || `Producto ${pId}`;
              
              this.nombresProductos.update(mapa => ({
                ...mapa,
                [pId.toString()]: nombreExtraido
              }));
              this.cdr.detectChanges();
            }
          },
          error: (err) => {
            console.warn(`No se pudo recuperar el nombre para el producto ID: ${pId}`, err);
          }
        });
      }
    });
  }

  // Método para descargar el PDF de la venta
  descargarPdf() {
    if (!this.ventaId) return;
    this.cargandoPdf.set(true);

    this.salesService.getPdfVenta(this.ventaId).subscribe({
      next: (res) => {
        const byteCharacters = atob(res.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, '_blank');

        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        this.cargandoPdf.set(false);
      },
      error: (err) => {
        console.error('Error al descargar el PDF:', err);
        this.cargandoPdf.set(false);
      }
    });
  }
}