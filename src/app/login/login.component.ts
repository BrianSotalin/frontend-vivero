import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngIf
import { FormsModule } from '@angular/forms';   // <--- ¡ESTA ES LA CLAVE!
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service'; // Importamos el servicio de toast

@Component({
  selector: 'app-login',
  standalone: true, // Verifica que esto sea true
  imports: [
    CommonModule, 
    FormsModule  // <--- Debes agregarlo aquí en la lista de imports
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService // Inyectamos el servicio
  ) {}

onLogin() {
  this.authService.login(this.credentials).subscribe({
    next: (response) => {
      // Guardamos el token (ajusta 'token' según como lo devuelva tu API)
      localStorage.setItem('token', response.token); 
      localStorage.setItem('username', this.credentials.username);

      this.toastService.show(`¡Bienvenido/a, ${this.credentials.username}! 🌿`);
      // Redirigimos a la ruta del dashboard
      this.router.navigate(['/dashboard']);
    },
    error: (err) => {
        this.toastService.show("Error: Credenciales incorrectas ❌");
      }
  });
}
}