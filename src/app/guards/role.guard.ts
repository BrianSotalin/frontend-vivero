import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthRoleService } from '../services/auth-role.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authRoleService = inject(AuthRoleService);
  const router = inject(Router);

  const rolesPermitidos: string[] = route.data['roles'] ?? [];
  const rol = authRoleService.getRol();

  if (!rol) {
    router.navigate(['/unauthorized']);
    return false;
  }

  if (rolesPermitidos.length === 0 || rolesPermitidos.includes(rol)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};