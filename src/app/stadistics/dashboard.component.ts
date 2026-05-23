import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { EstadisticasService } from '../services/stadistics.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe], // Importante para usar *ngIf y pipes
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.css'
})
export class DashboardComponent {
// Inyectamos los servicios
  private statsService = inject(EstadisticasService);
  
  
  // Signal para los datos del dashboard
  resumen = signal<any>(null);
  constructor() {
    // 3. Este bloque SOLO se ejecuta en el navegador del cliente.
    // Evita el error "localStorage is not defined" durante el renderizado de servidor.
    afterNextRender(() => {
      const token = localStorage.getItem('token');
      if (token) {
        this.obtenerEstadisticas(token);
      } else {
        console.warn('No se encontró un token en el almacenamiento local.');
      }
    });
  }

  obtenerEstadisticas(token: string) {
this.statsService.getResumen().subscribe({
      next: (data) => {
        this.resumen.set(data);
      },
      error: (err) => console.error('Error cargando estadísticas', err)
    });
  }
}