import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/user.service';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuario-list',
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
    IconField,
    InputIcon,
    TagModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UsuarioListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  usuarios = signal<any[]>([]);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios', err),
    });
  }

  abrirConfirmacion(usuario: any) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar al usuario <strong>${usuario.username}</strong>? Esta acción no se puede deshacer.`,
      header: `Eliminar "${usuario.username}"`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.eliminarUsuario(usuario),
    });
  }

  eliminarUsuario(usuario: any) {
    this.usuarioService.deleteUsuario(usuario.id).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario eliminado',
          detail: `${usuario.username} fue eliminado con éxito.`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el usuario.',
        });
      },
    });
  }
}