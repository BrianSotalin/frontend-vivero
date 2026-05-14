import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {authInterceptor} from './interceptors/auth.interceptor' 

// Importante: Necesitamos esto para que funcionen las peticiones a la API
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Habilita el cliente HTTP globalmente
    provideHttpClient(
    withFetch(),
    withInterceptors([authInterceptor])
  )
  ]
};