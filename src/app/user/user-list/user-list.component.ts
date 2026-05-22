import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'] // Reutiliza tus estilos de tablas
})
export class UsuarioListComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  
  usuarios = signal<any[]>([]);
  searchText = signal<string>(''); 
  usuarioSeleccionado = signal<any>(null);

  paginaActual = signal<number>(1);
  usuariosPorPagina = signal<number>(5);

  usuariosFiltrados = computed(() => {
    const texto = this.searchText().toLowerCase().trim();
    if (!texto) return this.usuarios();
    return this.usuarios().filter(u => u.username && u.username.toLowerCase().includes(texto));
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.usuariosFiltrados().length / this.usuariosPorPagina());
  });

  usuariosPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.usuariosPorPagina();
    const fin = inicio + this.usuariosPorPagina();
    return this.usuariosFiltrados().slice(inicio, fin);
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  onSearchChange() {
    this.paginaActual.set(1);
  }

  abrirConfirmacion(usuario: any, modal: HTMLDialogElement) {
    this.usuarioSeleccionado.set(usuario);
    modal.showModal();
  }

  cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.usuarioSeleccionado.set(null);
  }

  confirmarEliminar(modal: HTMLDialogElement) {
    const user = this.usuarioSeleccionado();
    if (user) {
      this.usuarioService.deleteUsuario(user.id).subscribe({
        next: () => {
          this.cerrarModal(modal);
          this.cargarUsuarios();
          alert('Usuario eliminado con éxito!');
        },
        error: (err) => alert('No se pudo eliminar el usuario')
      });
    }
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual.set(nuevaPagina);
    }
  }
    // Al cambiar el tamaño (5, 10, 20), reiniciamos a la página 1 para evitar desbordamientos
  cambiarTamano() {
    this.paginaActual.set(1);
  }
}