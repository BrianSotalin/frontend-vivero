import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EstadisticasService } from '../services/stadistics.service';
import { ProductService } from '../services/product.service';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ChartModule, ToastModule],
  providers: [MessageService],
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.css'
})
export class DashboardComponent {
  private statsService = inject(EstadisticasService);
  private messageService = inject(MessageService);
  private productoService = inject(ProductService);

  resumen = signal<any>(null);
  chartVentasPorMes = signal<any>(null);
  chartTopProductos = signal<any>(null);

  chartOptions = {
    plugins: {
      legend: { display: false }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  chartOptionsBar = {
    indexAxis: 'y',  // barras horizontales
    plugins: {
      legend: { display: false }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

chartIngresos = signal<any>(null);

chartOptionsDoughnut = {
  cutout: '75%',
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  responsive: true,
  maintainAspectRatio: false,
};
  constructor() {
afterNextRender(() => {
  const token = localStorage.getItem('token');
  if (token) {
    this.obtenerEstadisticas();
  }

  // Muestra el toast de bienvenida si viene del login
  const showWelcome = localStorage.getItem('showWelcome');
  if (showWelcome === 'true') {
    const username = localStorage.getItem('username') || 'Usuario';
    this.messageService.add({
      severity: 'success',
      summary: 'Bienvenido',
      detail: `¡Bienvenido/a, ${username}!`
    });
    localStorage.removeItem('showWelcome');
  }
});
  }

  obtenerEstadisticas() {
this.statsService.getResumen().subscribe({
  next: (data) => {
    this.resumen.set(data);
    // Gráfico doughnut de ingresos (visual decorativo)
    this.chartIngresos.set({
      labels: ['Ingresos'],
      datasets: [{
        data: [data.ingresosTotales, data.ingresosTotales * 0.3],
        backgroundColor: ['#66BB6A', '#e8f5e9'],
        borderWidth: 0,
      }]
    });
  },
  error: (err) => console.error('Error cargando resumen', err)
});

    this.statsService.getVentasPorMes().subscribe({
      next: (data) => {
        this.chartVentasPorMes.set({
          labels: data.map(d => `${MESES[d.mes - 1]} ${d.anio}`),
          datasets: [{
            label: 'Ventas',
            data: data.map(d => d.cantidad),
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          }]
        });
      },
      error: (err) => console.error('Error cargando ventas por mes', err)
    });

// Lanzamos ambas peticiones en paralelo de manera eficiente
forkJoin({
  topProductos: this.statsService.getTopProductos(),
  catalogo: this.productoService.getProductos() // 👈 Asegúrate de usar el nombre real de tu servicio de productos
}).subscribe({
  next: ({ topProductos, catalogo }) => {
    
    // 1. Mapeamos las etiquetas buscando el nombre real de la planta en el catálogo
    const labelsMapeadas = topProductos.map(item => {
      // Buscamos coincidencia comparando IDs como String
      const plantaReal = catalogo.find(p => p.id.toString() === item.nombre.toString());
      return plantaReal ? plantaReal.nombre : `Producto ${item.nombre}`;
    });

    // 2. Extraemos las cantidades
    const cantidadesMapeadas = topProductos.map(item => item.cantidad);

    // 3. Seteamos el Signal con el objeto completamente estructurado de golpe
    this.chartTopProductos.set({
      labels: labelsMapeadas,
      datasets: [{
        label: 'Unidades Vendidas',
        data: cantidadesMapeadas,
        backgroundColor: [
          '#66BB6A', '#42A5F5', '#FFA726', '#AB47BC', '#26C6DA'
        ],
        borderWidth: 1
      }]
    });
  },
  error: (err) => {
    console.error('Error cruzando datos de estadísticas e inventario:', err);
  }
});
  }
}