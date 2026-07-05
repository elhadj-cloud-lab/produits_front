import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { adminGuard } from './admin-guard';
import { AuthService } from './services/auth-service';

describe('adminGuard', () => {
  let authService: {
    decodeJWT: ReturnType<typeof vi.fn>;
    isAdmin: ReturnType<typeof vi.fn>;
  };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = {
      decodeJWT: vi.fn(),
      isAdmin: vi.fn(),
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
    TestBed.runInInjectionContext(() => adminGuard({} as never, {} as never));

  it('allows access for admin users', () => {
    authService.isAdmin.mockReturnValue(true);
    expect(runGuard()).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('redirects non-admin users to forbidden page', () => {
    authService.isAdmin.mockReturnValue(false);
    expect(runGuard()).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/app-forbidden']);
  });
});
