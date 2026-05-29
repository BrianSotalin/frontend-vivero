import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SalesService } from '../../services/sales.service';

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
  selector: 'app-sales-list',
  standalone: true,
  imports: [
    CommonModule,
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
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'],
})
export class SalesListComponent implements OnInit {
  private salesService = inject(SalesService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  sales = signal<any[]>([]);

  // Mapeo de estado a texto y severidad de p-tag
  textosEstado: { [key: number]: string } = {
    0: 'PAGADO',
    1: 'DEUDA',
    2: 'ABONADO',
  };

 severidadEstado: { [key: number]: 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' } = {
  0: 'success',
  1: 'danger',
  2: 'warn',
};

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.salesService.getSales().subscribe({
      next: (data) => this.sales.set(data),
      error: (err) => console.error('Error cargando ventas:', err),
    });
  }

  abrirConfirmacion(venta: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas quitar la venta <strong>#${venta.codigo}</strong> del historial? Esta acción no se puede deshacer.`,
      header: `Eliminar #${venta.codigo}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarVenta(venta),
    });
  }

  eliminarVenta(venta: any) {
    this.salesService.deleteSale(venta.id).subscribe({
      next: () => {
        this.cargarVentas();
        this.messageService.add({
          severity: 'success',
          summary: 'Venta eliminada',
          detail: `Venta #${venta.codigo} eliminada con éxito.`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar la venta.',
        });
      },
    });
  }
}