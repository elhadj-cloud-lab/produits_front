import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './services/auth-service';
import {catchError, map, of} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.loadToken();

  if (authService.getToken() && !authService.isTokenExpired()) {
    authService.decodeJWT();
    return true;
  }

  const refreshToken = authService.getRefreshToken();
  if (!refreshToken) {
    router.navigate(['/login']);
    return false;
  }

  return authService.refreshAccessToken().pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
