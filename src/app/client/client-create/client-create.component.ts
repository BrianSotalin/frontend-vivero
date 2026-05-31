import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './client-create.component.html',
  styleUrls: ['./client-create.component.css']
})
export class ClienteCreateComponent {
  private clienteService = inject(ClientService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  nuevoCliente = {
    nombre: '',
    telefono: '',
    email: ''
  };

  guardar(formulario: NgForm) {
    if (formulario.invalid) return;

    this.clienteService.createCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente registrado con éxito.' });
        setTimeout(() => this.router.navigate(['/clientes']), 1500);
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          const mensajes = Object.values(err.error).join(', ');
          this.messageService.add({ severity: 'error', summary: 'Error de validación', detail: mensajes });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar el cliente.' });
        }
      }
    });
  }
}