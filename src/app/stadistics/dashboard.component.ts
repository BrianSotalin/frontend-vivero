import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EstadisticasService } from '../services/stadistics.service';
import { ChartModule } from 'primeng/chart';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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

    this.statsService.getTopProductos().subscribe({
      next: (data) => {
        this.chartTopProductos.set({
          labels: data.map(d => d.nombre),
          datasets: [{
            label: 'Unidades',
            data: data.map(d => d.cantidad),
            backgroundColor: [
              '#66BB6A', '#42A5F5', '#FFA726', '#AB47BC', '#26C6DA'
            ],
          }]
        });
      },
      error: (err) => console.error('Error cargando top productos', err)
    });
  }
}