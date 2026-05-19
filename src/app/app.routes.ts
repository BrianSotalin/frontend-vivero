import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './stadistics/dashboard.component';
import { UnauthorizedComponent } from './error/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { ProductEditComponent } from './product/product-edit/product-edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', 
    component: DashboardComponent ,
    canActivate: [authGuard]
  },
  { path: 'productos', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'productos/nuevo', component: ProductFormComponent, canActivate: [authGuard]},
  { path: 'productos/editar/:id', component: ProductEditComponent, canActivate: [authGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '',redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];