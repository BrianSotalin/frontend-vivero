import { Component, signal, inject, afterNextRender, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  private authService = inject(AuthService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  authRoleService = inject(AuthRoleService);

  username = signal<string>('Usuario');
  isLoggedIn = signal<boolean>(false);
  isMenuOpen = signal<boolean>(false);

  toggleMenu() {
    this.isMenuOpen.update(val => !val);
  }

  constructor() {
    afterNextRender(() => {
      this.verificarSesion();
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.verificarSesion();
      });
    });
  }

  verificarSesion() {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const name = typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null;
    const rutaActual = this.router.url.split('?')[0];
    const rutasSinSidebar = ['/login', '/unauthorized'];
    const esRutaExcluida = rutasSinSidebar.includes(rutaActual);
    this.isLoggedIn.set(!!token && !esRutaExcluida);
    if (name) this.username.set(name);
  }

  obtenerNombreUsuario(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('username') || 'Usuario';
    }
    return 'Usuario';
  }

  cerrarSesion() {
    this.authService.logout();
    this.isLoggedIn.set(false);
  }
}