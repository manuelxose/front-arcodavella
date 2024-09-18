import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard invoked for route:', state.url);

  if (!authService.isAuthenticated()) {
    console.log('User is not authenticated. Redirecting to /auth/sign-up');
    router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  console.log('User is authenticated. Access granted.');
  return true;
};
