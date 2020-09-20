import { TestBed } from '@angular/core/testing';

import { AuthNegGuard } from './auth-neg.guard';

describe('AuthNegGuard', () => {
  let guard: AuthNegGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNegGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
