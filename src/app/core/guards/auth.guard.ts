import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard invoked for route:', state.url);

  // Define rutas públicas que no requieren autenticación
  const publicRoutes = ['/documents/terms-services', '/auth/sign-in', '/auth/sign-up'];

  // Si la ruta es pública, permite el acceso
  if (publicRoutes.includes(state.url)) {
    console.log('Ruta pública, acceso permitido:', state.url);
    return true;
  }

  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  if (!authService.isAuthenticated()) {
    console.log('User is not authenticated. Redirecting to /auth/sign-in');
    router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  console.log('User is authenticated. Access granted.');
  return true;
};
