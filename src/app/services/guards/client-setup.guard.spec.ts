import { TestBed } from '@angular/core/testing';

import { ClientSetupGuard } from './client-setup.guard';

describe('ClientSetupGuard', () => {
  let guard: ClientSetupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClientSetupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
