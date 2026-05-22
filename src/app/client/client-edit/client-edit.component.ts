import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-cliente-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css'] // Reutiliza el CSS que acabamos de crear para mantener el diseño
})
export class ClienteEditComponent implements OnInit {
  private clienteService = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  clienteId!: number;
  clienteEnEdicion: any = { nombre: '', telefono: '', email: '' };
  datosOriginales: any; // Aquí guardamos el clon para la comparación parcial estilo Postman

  ngOnInit() {
    // Capturamos el ID del cliente desde la URL
    this.clienteId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.clienteId) {
      this.clienteService.getClienteById(this.clienteId).subscribe({
        next: (data) => {
          this.clienteEnEdicion = data;
          this.datosOriginales = { ...data }; // Guardamos una copia exacta inicial de la BD
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al recuperar datos del cliente:', err);
          alert('No se pudo cargar la información del cliente.');
          this.router.navigate(['/clientes']);
        }
      });
    }
  }

  actualizar(formulario: NgForm) {
    if (formulario.invalid) return;

    // Creamos un objeto vacío donde solo meteremos lo que realmente cambió
    const camposModificados: any = {};

    // Comparamos campo por campo contra los datos originales
    if (this.clienteEnEdicion.nombre !== this.datosOriginales.nombre) {
      camposModificados.nombre = this.clienteEnEdicion.nombre;
    }
    if (this.clienteEnEdicion.telefono !== this.datosOriginales.telefono) {
      camposModificados.telefono = this.clienteEnEdicion.telefono;
    }
    if (this.clienteEnEdicion.email !== this.datosOriginales.email) {
      camposModificados.email = this.clienteEnEdicion.email;
    }

    // Si el usuario no modificó nada, no hacemos la petición HTTP y volvemos
    if (Object.keys(camposModificados).length === 0) {
      alert('No has realizado ningún cambio.');
      this.router.navigate(['/clientes']);
      return;
    }

    console.log('Enviando cambios parciales al PATCH de Java:', camposModificados);

    // Enviamos el PATCH con los datos filtrados
    this.clienteService.updateCliente(this.clienteId, camposModificados).subscribe({
      next: () => {
        alert('¡Cliente actualizado con éxito!');
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        console.error('Error al actualizar cliente:', err);
        alert(`Error al actualizar el cliente: ${err.message}${err.error ? ' - ' + JSON.stringify(err.error) : ''}`);
      }
    });
  }
}