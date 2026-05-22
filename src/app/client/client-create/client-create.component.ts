import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-cliente-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css'] // Reutiliza el CSS de tus formularios
})
export class ClienteCreateComponent {
  private clienteService = inject(ClientService);
  private router = inject(Router);

  // Estructura limpia que coincide con tu entidad de Java
  nuevoCliente = {
    nombre: '',
    telefono: '',
    email: ''
  };

  guardar(formulario: NgForm) {
    // Si el HTML detecta un error de validación, detenemos el envío
    if (formulario.invalid) return;

    this.clienteService.createCliente(this.nuevoCliente).subscribe({
      next: () => {
        alert('¡Cliente registrado con éxito!');
        this.router.navigate(['/clientes']); // Redirige al listado de clientes
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        // Si tu Spring Boot devuelve un error de validación @Valid (400)
        if (err.status === 400 && err.error) {
          const mensajes = Object.values(err.error).join('\n');
          alert(`Error de validación:\n${mensajes}`);
        } else {
          alert('Ocurrió un error al guardar el cliente.');
        }
      }
    });
  }
}