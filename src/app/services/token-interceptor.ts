import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

const exclude_array: string[] = ['/login', '/register', '/verifyEmail', '/refresh'];

function toExclude(url: string) {
  for (const path of exclude_array) {
    if (url.includes(path)) {
      return true;
    }
  }
  return false;
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (toExclude(req.url)) {
    return next(req);
  }

  const sendWithToken = (token: string) =>
    next(req.clone({ setHeaders: { Authorization: 'Bearer ' + token } }));

  const token = authService.getToken();

  if (token && authService.isTokenExpired() && authService.getRefreshToken()) {
    return authService.refreshAccessToken().pipe(
      switchMap(() => sendWithToken(authService.getToken())),
      catchError(() => {
        authService.logout();
        return throwError(() => new Error('Session expirée'));
      })
    );
  }

  return sendWithToken(token);
};
