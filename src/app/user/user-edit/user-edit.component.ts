import { Component, inject, OnInit,signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/user.service';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  cargando = signal<boolean>(true);

  usuarioId!: number;
  usuarioEnEdicion: any = { password: '', rol: '', username: '' };
  datosOriginales: any;

tieneMayuscula(): boolean { return /[A-Z]/.test(this.usuarioEnEdicion.password || ''); }
tieneMinuscula(): boolean { return /[a-z]/.test(this.usuarioEnEdicion.password || ''); }
tieneEspecial(): boolean { return /[!@#$%^&*()\-_=+\[\]{};':",.<>/?]/.test(this.usuarioEnEdicion.password || ''); }
tieneLength(): boolean { return (this.usuarioEnEdicion.password || '').length >= 8; }
passwordValida(): boolean {
  const p = this.usuarioEnEdicion.password;
  // Si está vacía, es válida (no se cambia)
  if (!p || p.trim() === '') return true;
  // Si tiene algo, debe cumplir las reglas
  return this.tieneLength() && this.tieneMayuscula() && this.tieneMinuscula() && this.tieneEspecial();
}

  ngOnInit() {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.usuarioId) {
      this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
        next: (data) => {
          this.usuarioEnEdicion = data;
          this.usuarioEnEdicion.password = ''; 
          this.datosOriginales = { ...data };
          this.cargando.set(false);
          this.cdr.detectChanges();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información del usuario.' });
          setTimeout(() => this.router.navigate(['/usuarios']), 1500);
        }
      });
    }
  }

  actualizar(formulario: NgForm) {
    if (formulario.invalid) return;

    const camposModificados: any = {};

    if (this.usuarioEnEdicion.rol !== this.datosOriginales.rol)
      camposModificados.rol = this.usuarioEnEdicion.rol;

    if (this.usuarioEnEdicion.password && this.usuarioEnEdicion.password.trim() !== '')
      camposModificados.password = this.usuarioEnEdicion.password;

    if (Object.keys(camposModificados).length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sin cambios', detail: 'No has realizado ningún cambio.' });
      setTimeout(() => this.router.navigate(['/usuarios']), 1500);
      return;
    }

    const rolAEnviar = camposModificados.rol ?? '';
    const passAEnviar = camposModificados.password ?? '';

    this.usuarioService.updateUserAndPass(this.usuarioId, rolAEnviar, passAEnviar).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario actualizado con éxito.' });
        setTimeout(() => this.router.navigate(['/usuarios']), 1500);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el usuario.' });
      }
    });
  }
}