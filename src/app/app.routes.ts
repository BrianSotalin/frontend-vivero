import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './stadistics/dashboard.component';
import { UnauthorizedComponent } from './error/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { ProductListComponent } from './product/product-list.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', 
    component: DashboardComponent ,
    canActivate: [authGuard]
  },
  { path: 'productos', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '',redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];