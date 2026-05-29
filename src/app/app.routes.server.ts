import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'productos/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'clientes/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'usuarios/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'ventas/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'ventas/editar/:id',   // ← nueva
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];