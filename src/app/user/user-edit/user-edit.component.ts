import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/user.service';

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'] // Reutiliza los estilos de tus formularios
})
export class UsuarioEditComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuarioId!: number;
  usuarioEnEdicion: any = { password: '', rol: '', username: '' };
  datosOriginales: any; 

  ngOnInit() {
    this.usuarioId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.usuarioId) {
      // Cargamos el usuario para saber qué valores actuales tiene
      this.usuarioService.getUsuarioById(this.usuarioId).subscribe({
        next: (data) => {
          this.usuarioEnEdicion = data;
          this.datosOriginales = { ...data }; // Guardamos una copia exacta inicial de la BD
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo cargar la información del usuario.');
          this.router.navigate(['/usuarios']);
        }
      });
    }
  }

actualizar(formulario: NgForm) {
  if (formulario.invalid) return;

  // Creamos un objeto vacío donde solo meteremos lo que realmente cambió
  const camposModificados: any = {};

// 1. Comparamos los campos contra los originales
  if (this.usuarioEnEdicion.rol !== this.datosOriginales.rol) {
    camposModificados.rol = this.usuarioEnEdicion.rol;
  }
  
  // Para la contraseña, verificamos si escribieron algo real
  if (this.usuarioEnEdicion.password && this.usuarioEnEdicion.password.trim() !== '') {
    camposModificados.password = this.usuarioEnEdicion.password;
  }
   // Si el usuario no modificó nada, no hacemos la petición HTTP y volvemos
    if (Object.keys(camposModificados).length === 0) {
      alert('No has realizado ningún cambio.');
      this.router.navigate(['/usuarios']);
      return;
    }
 console.log('Enviando cambios parciales al PATCH de Java:', camposModificados);

 // 2. SOLUCIÓN: Extraemos con un condicional. Si no cambiaron, mandamos string vacío.
  const rolAEnviar = camposModificados.rol ? camposModificados.rol : '';
  const passAEnviar = camposModificados.password ? camposModificados.password : '';
  
  this.usuarioService.updateUserAndPass(this.usuarioId, rolAEnviar, passAEnviar).subscribe({
    next: () => {
      alert('¡Usuario actualizado con éxito!');
      this.router.navigate(['/usuarios']);
    },
    error: (err) => {
      console.error(err);
      alert('Error al actualizar el usuario.');
    }
  });
}
}