import { Component, signal, inject, afterNextRender } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal<string>('Usuario');
  toast = signal<{show: boolean, message: string}>({ show: false, message: '' });
  
  // Signal para controlar la visibilidad del menú
  isLoggedIn = signal<boolean>(false);
  // Dentro de tu clase App
isMenuOpen = signal<boolean>(false);

toggleMenu() {
  this.isMenuOpen.update(val => !val);
}

  constructor() {
    this.toastService.toastState.subscribe(state => this.toast.set(state));

    afterNextRender(() => {
      this.verificarSesion();
      
      // Escuchar cambios de ruta para re-verificar la sesión automáticamente
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.verificarSesion();
      });
    });
  }


verificarSesion() {
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('username');
  
  // Lista de rutas que NUNCA deben mostrar el sidebar
  const rutasSinSidebar = ['/login', '/unauthorized'];
  const rutaActual = this.router.url;

  // Se muestra el sidebar SOLO si hay token Y la ruta no está en la lista negra
  const esRutaExcluida = rutasSinSidebar.some(ruta => rutaActual.includes(ruta));
  
  this.isLoggedIn.set(!!token && !esRutaExcluida); 

  if (name) this.username.set(name);
}

  obtenerNombreUsuario(): string {
    // Si lo guardaste en el login, lo sacas de aquí. 
    // Si no, podrías sacarlo del payload del JWT decodificado.
    return localStorage.getItem('username') || 'Usuario';
  }
  cerrarSesion() {
    this.authService.logout();
    this.isLoggedIn.set(false);
  }
}
