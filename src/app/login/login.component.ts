import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// PrimeNG
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  credentials = { username: '', password: '' };

  onLogin() {
    this.authService.login(this.credentials).subscribe({
next: (response) => {
  localStorage.setItem('token', response.token);
  localStorage.setItem('username', this.credentials.username);
  localStorage.setItem('showWelcome', 'true'); 

  const payload = JSON.parse(atob(response.token.split('.')[1]));
  const rol = payload.rol;

  if (rol === 'EMPLOYEE') {
    this.router.navigate(['/ventas']);
  } else {
    this.router.navigate(['/dashboard']);
  }
},
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Credenciales incorrectas.'
        });
      }
    });
  }
}