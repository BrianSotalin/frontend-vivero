import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';

// PrimeNG v19+
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    IconField,      // ← ya no es IconFieldModule
    InputIcon,      // ← ya no es InputIconModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
})
export class ClientListComponent implements OnInit {
  private clienteService = inject(ClientService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  clientes = signal<any[]>([]);

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error cargando clientes', err),
    });
  }

  abrirConfirmacion(cliente: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar a <strong>${cliente.nombre}</strong>? Esta acción no se puede deshacer.`,
      header: `Eliminar "${cliente.nombre}"`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarCliente(cliente),
    });
  }

  eliminarCliente(cliente: any) {
    this.clienteService.deleteCliente(cliente.id).subscribe({
      next: () => {
        this.cargarClientes();
        this.messageService.add({
          severity: 'success',
          summary: 'Cliente eliminado',
          detail: `${cliente.nombre} fue eliminado con éxito.`,
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'No se pudo eliminar el cliente.',
        });
      },
    });
  }
 

enviarWhatsApp(telefono: string): void {
  if (!telefono) return;
  
  // Limpiamos el string para dejar solo números puros (elimina espacios, guiones, "+", etc.)
  const numeroLimpio = telefono.replace(/\D/g, '');
  
  // Crea el enlace oficial de la API de WhatsApp
  const url = `https://wa.me/+593${numeroLimpio}`;
  
  // Abre el chat en una pestaña nueva del navegador o en la App de WhatsApp móvil
  window.open(url, '_blank');
}
}