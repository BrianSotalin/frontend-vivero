import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/user.service';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'] // Reutiliza el CSS de tus formularios
})
export class UsuarioCreateComponent {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  nuevoUsuario = {
    username: '',
    password: '',
    rol: 'USER' // Rol por defecto
  };

  guardar(formulario: NgForm) {
    if (formulario.invalid) return;

    this.usuarioService.createUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        alert('¡Usuario creado correctamente!');
        this.router.navigate(['/usuarios']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        // Si tu Spring Boot devuelve un error de validación @Valid (400)
        if (err.status === 400 && err.error) {
          const mensajes = Object.values(err.error).join('\n');
          alert(`Error de validación:\n${mensajes}`);
        } else {
          alert('Ocurrió un error al guardar el usuario.');
        }
      }
    });
  }
}