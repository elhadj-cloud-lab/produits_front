import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './services/auth-service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.decodeJWT();

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/app-forbidden']);
  return false;
};
