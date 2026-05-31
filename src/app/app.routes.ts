import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './stadistics/dashboard.component';
import { UnauthorizedComponent } from './error/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-create/product-create.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';
import { ClientListComponent } from './client/client-list/client-list.component';
import { ClienteCreateComponent } from './client/client-create/client-create.component';
import { ClienteEditComponent } from './client/client-edit/client-edit.component';
import { UsuarioListComponent } from './user/user-list/user-list.component';
import { UsuarioCreateComponent } from './user/user-create/user-create.component';
import { UsuarioEditComponent } from './user/user-edit/user-edit.component';
import { SalesListComponent } from './sales/sales-list/sales-list.component';
import { SalesDetailComponent } from './sales/sales-detail/sales-detail.component';
import { SalesCreateComponent } from './sales/sales-create/sales-create.component';
import { SalesEditComponent } from './sales/sales-edit/sales-edit.component';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  // ADMIN y USER
  { path: 'dashboard', component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: 'productos', component: ProductListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: 'productos/nuevo', component: ProductFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: 'productos/editar/:id', component: ProductEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: 'clientes', component: ClientListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: 'clientes/nuevo', component: ClienteCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },
  { path: 'clientes/editar/:id', component: ClienteEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER'] }
  },

  // Solo ADMIN
  { path: 'usuarios', component: UsuarioListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: 'usuarios/nuevo', component: UsuarioCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: 'usuarios/editar/:id', component: UsuarioEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },

  // Todos los roles
  { path: 'ventas', component: SalesListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER', 'EMPLOYEE'] }
  },
  { path: 'ventas/nueva', component: SalesCreateComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER', 'EMPLOYEE'] }
  },
  { path: 'ventas/:id', component: SalesDetailComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER', 'EMPLOYEE'] }
  },
  { path: 'ventas/editar/:id', component: SalesEditComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'USER', 'EMPLOYEE'] }
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];