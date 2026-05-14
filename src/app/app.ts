import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('vivero-frontend');

  // Usamos inject para obtener el servicio
  private toastService = inject(ToastService);
  
  // Signal para manejar el estado del toast en la vista
  toast = signal<{show: boolean, message: string}>({ show: false, message: '' });

  constructor() {
    // Nos suscribimos a los cambios del toast
    this.toastService.toastState.subscribe(state => {
      console.log('Toast recibido en App:', state);
      this.toast.set(state);
    });
  }
}
