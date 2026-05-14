import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Verificamos si estamos en el navegador para leer localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return true; // Deja pasar
    }
  }

  // Si no hay token, mandamos a la página de "No Autorizado"
  router.navigate(['/unauthorized']);
  return false;
};