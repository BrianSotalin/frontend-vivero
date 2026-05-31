import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthRoleService {
  private platformId = inject(PLATFORM_ID);

  getRol(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol ?? null;
    } catch {
      return null;
    }
  }

  isAdmin(): boolean { return this.getRol() === 'ADMIN'; }
  isUser(): boolean { return this.getRol() === 'USER'; }
  isEmployee(): boolean { return this.getRol() === 'EMPLOYEE'; }

  hasAnyRole(...roles: string[]): boolean {
    return roles.includes(this.getRol() ?? '');
  }
}