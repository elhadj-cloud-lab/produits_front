import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom, isObservable, Observable, of, throwError } from 'rxjs';

import { authGuard } from './auth-guard';
import { AuthService } from './services/auth-service';

describe('authGuard', () => {
  let authService: {
    loadToken: ReturnType<typeof vi.fn>;
    getToken: ReturnType<typeof vi.fn>;
    isTokenExpired: ReturnType<typeof vi.fn>;
    decodeJWT: ReturnType<typeof vi.fn>;
    getRefreshToken: ReturnType<typeof vi.fn>;
    refreshAccessToken: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      loadToken: vi.fn(),
      getToken: vi.fn(),
      isTokenExpired: vi.fn(),
      decodeJWT: vi.fn(),
      getRefreshToken: vi.fn(),
      refreshAccessToken: vi.fn(),
    };
    router = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  const runGuard = () =>
    TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

  it('allows access with a valid token', () => {
    authService.getToken.mockReturnValue('valid-token');
    authService.isTokenExpired.mockReturnValue(false);

    expect(runGuard()).toBe(true);
    expect(authService.decodeJWT).toHaveBeenCalled();
  });

  it('redirects to login when no refresh token is available', () => {
    authService.getToken.mockReturnValue(undefined);
    authService.isTokenExpired.mockReturnValue(true);
    authService.getRefreshToken.mockReturnValue(null);

    expect(runGuard()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('refreshes the token when it is expired', async () => {
    authService.getToken.mockReturnValue('expired-token');
    authService.isTokenExpired.mockReturnValue(true);
    authService.getRefreshToken.mockReturnValue('refresh-token');
    authService.refreshAccessToken.mockReturnValue(of({} as never));

    const result = runGuard();
    expect(isObservable(result)).toBe(true);
    await expect(firstValueFrom(result as Observable<boolean>)).resolves.toBe(true);
  });

  it('redirects to login when refresh fails', async () => {
    authService.getToken.mockReturnValue('expired-token');
    authService.isTokenExpired.mockReturnValue(true);
    authService.getRefreshToken.mockReturnValue('refresh-token');
    authService.refreshAccessToken.mockReturnValue(
      throwError(() => new Error('refresh failed')),
    );

    const result = runGuard();
    expect(isObservable(result)).toBe(true);
    await expect(firstValueFrom(result as Observable<boolean>)).resolves.toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
