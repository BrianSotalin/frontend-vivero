# 🌿 Vivero La Vega — Frontend
 
Aplicación web para la gestión de un vivero. Desarrollada con **Angular 21** y **PrimeNG 21**, con renderizado del lado del servidor (SSR) mediante Angular Universal.
 
---
 
## 🚀 Tecnologías
 
| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21.2 | Framework principal |
| PrimeNG | 21.1 | Componentes UI |
| TypeScript | 5.x | Lenguaje |
| Angular SSR | 21.2 | Server-Side Rendering |
| Chart.js | latest | Gráficos del dashboard |
 
---
 
## 📋 Requisitos previos
 
- Node.js 20+
- npm 10+
- Backend de Vivero corriendo (ver [vivero-backend](https://github.com/BrianSotalin/vivero-backend-java))
---
 
## ⚙️ Instalación
 
```bash
# Clonar el repositorio
git clone https://github.com/BrianSotalin/frontend-vivero.git
cd frontend-vivero
 
# Instalar dependencias
npm install --legacy-peer-deps
```
 
---
 
## 🔧 Configuración
 
Edita `src/environments/environment.ts` con la URL de tu backend:
 
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```
 
Para producción, edita `src/environments/environment.production.ts`:
 
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-dominio.com/api'
};
```
 
---
 
## ▶️ Ejecución en desarrollo
 
```bash
ng serve
```
 
La aplicación estará disponible en `http://localhost:4200`.
 
---
 
## 🏗️ Build para producción
 
```bash
ng build --configuration production
```
 
El build se genera en `dist/vivero-frontend/`.
 
---
 
## 🐳 Docker
 
El proyecto incluye un `Dockerfile` optimizado para SSR:
 
```bash
# Build de la imagen
docker build -t vivero-frontend .
 
# Correr el contenedor
docker run -p 4000:4000 vivero-frontend
```
 
O usando Docker Compose desde la raíz del proyecto:
 
```bash
docker-compose up -d --build frontend-vivero
```
 
---
 
## 📁 Estructura del proyecto
 
```
src/
├── app/
│   ├── client/          # Módulo de clientes (CRUD)
│   ├── product/         # Módulo de productos (CRUD)
│   ├── sales/           # Módulo de ventas (CRUD + detalle)
│   ├── user/            # Módulo de usuarios (CRUD)
│   ├── stadistics/      # Dashboard con gráficos
│   ├── login/           # Autenticación
│   ├── guards/          # Auth guard + Role guard
│   ├── interceptors/    # JWT interceptor
│   ├── services/        # Servicios HTTP
│   └── error/           # Página de acceso no autorizado
├── environments/        # Configuración por entorno
└── styles.css           # Estilos globales + PrimeNG
```
 
---
 
## 🔐 Roles y permisos
 
| Módulo | ADMIN | USER | EMPLOYEE |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ❌ |
| Ventas | ✅ | ✅ | ✅ |
| Productos | ✅ | ✅ | ❌ |
| Clientes | ✅ | ✅ | ❌ |
| Usuarios | ✅ | ❌ | ❌ |
 
El control de roles se implementa mediante `RoleGuard` que decodifica el JWT y verifica el claim `rol`.
 
---
 
## 🗺️ Rutas principales
 
| Ruta | Componente | Roles permitidos |
|---|---|---|
| `/login` | LoginComponent | Público |
| `/dashboard` | DashboardComponent | ADMIN, USER |
| `/ventas` | SalesListComponent | ADMIN, USER, EMPLOYEE |
| `/ventas/nueva` | SalesCreateComponent | ADMIN, USER, EMPLOYEE |
| `/ventas/:id` | SalesDetailComponent | ADMIN, USER, EMPLOYEE |
| `/ventas/editar/:id` | SalesEditComponent | ADMIN, USER, EMPLOYEE |
| `/productos` | ProductListComponent | ADMIN, USER |
| `/clientes` | ClientListComponent | ADMIN, USER |
| `/usuarios` | UsuarioListComponent | ADMIN |
 
---
 
## 🌐 Deploy en VPS (Hostinger)
 
La aplicación está desplegada en `https://viveros-ecuador.devxsota.cloud` con:
 
- Nginx como reverse proxy
- SSL via Certbot
- Docker Compose para orquestación
Para actualizar en producción:
 
```bash
# En el VPS
cd ~/vivero
git -C frontend-vivero pull
docker-compose up -d --build frontend-vivero
```
