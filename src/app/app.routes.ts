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

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', 
    component: DashboardComponent ,
    canActivate: [authGuard]
  },
  /*Rutas protegidas para productos, solo accesibles si el usuario está autenticado*/
  { path: 'productos', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'productos/nuevo', component: ProductFormComponent, canActivate: [authGuard]},
  { path: 'productos/editar/:id', component: ProductEditComponent, canActivate: [authGuard] },
  /*Rutas protegidas para clientes, solo accesibles si el usuario está autenticado*/
  { path: 'clientes', component: ClientListComponent, canActivate: [authGuard] },
  { path: 'clientes/nuevo', component: ClienteCreateComponent, canActivate: [authGuard] },
  { path: 'clientes/editar/:id', component: ClienteEditComponent, canActivate: [authGuard] },
  /*Rutas protegidas para usuarios, solo accesibles si el usuario autenticado tiene rol ADMIN*/
  { path: 'usuarios', component: UsuarioListComponent, canActivate: [authGuard] },
  { path: 'usuarios/nuevo', component: UsuarioCreateComponent, canActivate: [authGuard] },
  { path: 'usuarios/editar/:id', component: UsuarioEditComponent, canActivate: [authGuard] },
  /*Rutas protegidas para ventas, solo accesibles si el usuario está autenticado*/
  { path: 'ventas', component: SalesListComponent, canActivate: [authGuard] },
    { path: 'ventas/nueva', component: SalesCreateComponent, canActivate: [authGuard] },
  { path: 'ventas/:id', component: SalesDetailComponent, canActivate: [authGuard] },
  { path: 'ventas/editar/:id', component: SalesEditComponent, canActivate: [authGuard] },
  /* Ruta para mostrar error de acceso no autorizado */
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '',redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];