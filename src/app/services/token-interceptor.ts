import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';
import { catchError, switchMap, throwError } from 'rxjs';

const exclude_array: string[] = ['/login', '/register', '/verifyEmail', '/refresh', '/logout'];
const RETRY_HEADER = 'X-Retry-After-Refresh';

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

  const sendWithToken = (token: string, isRetry = false) => {
    const headers: Record<string, string> = { Authorization: 'Bearer ' + token };
    if (isRetry) {
      headers[RETRY_HEADER] = 'true';
    }
    return next(req.clone({ setHeaders: headers }));
  };

  const refreshAndRetry = () => {
    if (!authService.getRefreshToken()) {
      authService.logout();
      return throwError(() => new Error('Session expirée'));
    }

    return authService.refreshAccessToken().pipe(
      switchMap(() => sendWithToken(authService.getToken(), true)),
      catchError(() => {
        authService.logout();
        return throwError(() => new Error('Session expirée'));
      })
    );
  };

  const with401Retry = (source: ReturnType<typeof sendWithToken>) =>
    source.pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !req.headers.has(RETRY_HEADER) && authService.getRefreshToken()) {
          return refreshAndRetry();
        }
        if (err.status === 401) {
          authService.logout();
        }
        return throwError(() => err);
      })
    );

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  if (authService.isTokenExpired() && authService.getRefreshToken()) {
    return refreshAndRetry();
  }

  return with401Retry(sendWithToken(token));
};
