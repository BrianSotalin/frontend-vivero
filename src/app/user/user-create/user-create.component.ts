import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/user.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UsuarioCreateComponent {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  nuevoUsuario = {
    username: '',
    password: '',
    rol: 'USER'
  };

  guardar(formulario: NgForm) {
    if (formulario.invalid) return;

    this.usuarioService.createUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente.' });
        setTimeout(() => this.router.navigate(['/usuarios']), 1500);
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          const mensajes = Object.values(err.error).join(', ');
          this.messageService.add({ severity: 'error', summary: 'Error de validación', detail: mensajes });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el usuario.' });
        }
      }
    });
  }
}