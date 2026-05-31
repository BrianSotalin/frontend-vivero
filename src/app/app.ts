import { Component, signal, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule , isPlatformBrowser} from '@angular/common';
import { ToastService } from './services/toast.service';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { AuthRoleService } from './services/auth-role.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  authRoleService = inject(AuthRoleService);

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
  // 1. Obtener datos (solo si estamos en el navegador)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const name = typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null;
  
  // 2. Obtener la ruta limpia (sin parámetros de búsqueda como ?id=1)
  const rutaActual = this.router.url.split('?')[0];

  // 3. Definir rutas prohibidas de forma exacta
  const rutasSinSidebar = ['/login', '/unauthorized'];
  
  // 4. Verificación estricta
  const esRutaExcluida = rutasSinSidebar.includes(rutaActual);
  
  // 5. El sidebar solo vive si hay token Y no es una ruta excluida
  this.isLoggedIn.set(!!token && !esRutaExcluida); 

  if (name) this.username.set(name);
}


  obtenerNombreUsuario(): string {
 if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username') || 'Usuario';
    }
    return 'Usuario'; // Valor por defecto durante el renderizado en servidor
  }
  cerrarSesion() {
    this.authService.logout();
    this.isLoggedIn.set(false);
  }
}
