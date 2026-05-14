import { Component, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { EstadisticasService } from '../services/stadistics.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink], // Importante para usar *ngIf y pipes
  templateUrl: 'dashboard.component.html',
  styleUrl: 'dashboard.component.css'
})
export class DashboardComponent {
// Inyectamos los servicios
  private authService = inject(AuthService);
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
      error: (err) => {
        console.error('Error al obtener estadísticas:', err);
        // Si el servidor responde 401 (No autorizado), cerramos sesión
        if (err.status === 401) {
          this.authService.logout();
        }
      }
    });
  }
  obtenerNombreUsuario(): string {
    // Si lo guardaste en el login, lo sacas de aquí. 
    // Si no, podrías sacarlo del payload del JWT decodificado.
    return localStorage.getItem('username') || 'Usuario';
  }

  cerrarSesion() {
    this.authService.logout();
  }
}