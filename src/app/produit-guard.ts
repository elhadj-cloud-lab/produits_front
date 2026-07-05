import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './services/auth-service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.loadToken();

  if (!authService.getToken() && !authService.getRefreshToken()) {
    router.navigate(['/login']);
    return false;
  }

  authService.decodeJWT();

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/app-forbidden']);
  return false;
};
