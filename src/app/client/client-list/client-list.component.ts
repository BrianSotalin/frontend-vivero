import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'] // Reutiliza los estilos de productos
})
export class ClientListComponent implements OnInit {
  private clienteService = inject(ClientService);
  
  clientes = signal<any[]>([]);
  searchText = signal<string>(''); 
  clienteSeleccionado = signal<any>(null);

  // Paginación
  paginaActual = signal<number>(1);
  clientesPorPagina = signal<number>(5);

  // Filtrado reactivo por nombre de cliente
  clientesFiltrados = computed(() => {
    const texto = this.searchText().toLowerCase().trim();
    if (!texto) return this.clientes();
    return this.clientes().filter(c => c.nombre && c.nombre.toLowerCase().includes(texto));
  });

  totalPaginas = computed(() => {
    return Math.ceil(this.clientesFiltrados().length / this.clientesPorPagina());
  });

  clientesPaginados = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.clientesPorPagina();
    const fin = inicio + this.clientesPorPagina();
    return this.clientesFiltrados().slice(inicio, fin);
  });

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes.set(data),
      error: (err) => console.error('Error cargando clientes', err)
    });
  }

  onSearchChange() {
    this.paginaActual.set(1);
  }

  abrirConfirmacion(cliente: any, modal: HTMLDialogElement) {
    this.clienteSeleccionado.set(cliente);
    modal.showModal();
  }

  cerrarModal(modal: HTMLDialogElement) {
    modal.close();
    this.clienteSeleccionado.set(null);
  }

  confirmarEliminar(modal: HTMLDialogElement) {
    const cli = this.clienteSeleccionado();
    if (cli) {
      this.clienteService.deleteCliente(cli.id).subscribe({
        next: () => {
          this.cerrarModal(modal);
          this.cargarClientes();
          alert('Cliente eliminado con éxito! 👤');
        },
        error: (err) => {
          console.error('Error al eliminar el cliente', err);
          alert(`No se pudo eliminar el cliente : ${err.error?.message || err.message}`);
        }
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