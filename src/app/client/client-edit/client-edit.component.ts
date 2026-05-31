import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClienteEditComponent implements OnInit {
  private clienteService = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);

  clienteId!: number;
  clienteEnEdicion: any = { nombre: '', telefono: '', email: '' };
  datosOriginales: any;

  ngOnInit() {
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clienteId) {
      this.clienteService.getClienteById(this.clienteId).subscribe({
        next: (data) => {
          this.clienteEnEdicion = data;
          this.datosOriginales = { ...data };
          this.cdr.detectChanges();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del cliente.' });
          setTimeout(() => this.router.navigate(['/clientes']), 1500);
        }
      });
    }
  }

  actualizar(formulario: NgForm) {
    if (formulario.invalid) return;

    const camposModificados: any = {};

    if (this.clienteEnEdicion.nombre !== this.datosOriginales.nombre)
      camposModificados.nombre = this.clienteEnEdicion.nombre;
    if (this.clienteEnEdicion.telefono !== this.datosOriginales.telefono)
      camposModificados.telefono = this.clienteEnEdicion.telefono;
    if (this.clienteEnEdicion.email !== this.datosOriginales.email)
      camposModificados.email = this.clienteEnEdicion.email;

    if (Object.keys(camposModificados).length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sin cambios', detail: 'No has realizado ningún cambio.' });
      setTimeout(() => this.router.navigate(['/clientes']), 1500);
      return;
    }

    this.clienteService.updateCliente(this.clienteId, camposModificados).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado con éxito.' });
        setTimeout(() => this.router.navigate(['/clientes']), 1500);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al actualizar el cliente.' });
      }
    });
  }
}