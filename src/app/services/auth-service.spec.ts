import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from './auth-service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('stores and retrieves pending registration data', () => {
    service.setPendingRegistration({username: 'alice', email: 'alice@test.com'});

    expect(service.getPendingRegistration()).toEqual({
      username: 'alice',
      email: 'alice@test.com',
    });
  });

  it('clears pending registration data', () => {
    service.setPendingRegistration({username: 'bob', email: 'bob@test.com'});
    service.clearPendingRegistration();

    expect(service.getPendingRegistration()).toBeNull();
  });

  it('detects admin role', () => {
    service.roles = ['ADMIN', 'USER'];
    expect(service.isAdmin()).toBe(true);

    service.roles = ['USER'];
    expect(service.isAdmin()).toBe(false);
  });
});
