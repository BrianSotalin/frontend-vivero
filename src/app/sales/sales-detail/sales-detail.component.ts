import { Component, inject, OnInit, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SalesService } from '../../services/sales.service';

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  venta = signal<any>(null);
  cargandoPdf = signal<boolean>(false);

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
      },
      error: (err: any) => {
        console.error('Error al cargar el detalle:', err);
        this.router.navigate(['/ventas']);
      }
    });
  }
  // Método para descargar el PDF de la venta
descargarPdf() {
  if (!this.ventaId) return;
  this.cargandoPdf.set(true);

  this.salesService.getPdfVenta(this.ventaId).subscribe({
    next: (res) => {
      // 1. Convertimos la cadena Base64 en un array de bytes
      const byteCharacters = atob(res.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      // 2. Creamos un BLOB (Binary Large Object) con el tipo mime correcto
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // 3. Creamos una URL nativa del navegador para ese objeto
      const blobUrl = URL.createObjectURL(blob);

      // 4. En móviles es mucho mejor abrirlo en una nueva pestaña (Safari lo ama)
      window.open(blobUrl, '_blank');

      // Limpieza de memoria
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