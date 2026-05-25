import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../services/sales.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css'] // Mismo CSS de tus tablas anteriores
})
export class SalesListComponent implements OnInit {
  private salesService = inject(SalesService);

  sales = signal<any[]>([]);
  searchText = signal<string>('');

  // Paginación
  paginaActual = signal<number>(1);
  ventasPorPagina = signal<number>(5);

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.salesService.getSales().subscribe({
      next: (data) => this.sales.set(data),
      error: (err) => console.error('Error cargando ventas:', err)
    });
  }

  // Filtrado inteligente por Comprobante o por Nombre de Cliente
  salesFiltradas = computed(() => {
    const texto = this.searchText().toLowerCase().trim();
    if (!texto) return this.sales();

    return this.sales().filter(v => {
      const numComprobante = v.codigo?.toLowerCase() || '';
      const nombreCliente = v.cliente?.nombre?.toLowerCase() || 'consumidor final';
      return numComprobante.includes(texto) || nombreCliente.includes(texto);
    });
  });

  // Cálculos de paginación reactiva
  totalPaginas = computed(() => Math.ceil(this.salesFiltradas().length / this.ventasPorPagina()));

  ventasPaginadas = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.ventasPorPagina();
    const fin = inicio + this.ventasPorPagina();
    return this.salesFiltradas().slice(inicio, fin);
  });

  onSearchChange() {
    this.paginaActual.set(1); // Resetea a la primera página al escribir
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }
    // Al cambiar el tamaño (5, 10, 20), reiniciamos a la página 1 para evitar desbordamientos
  cambiarTamano() {
    this.paginaActual.set(1);
  }
}