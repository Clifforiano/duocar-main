import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { autoGuard } from './auto.guard';

describe('autoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => autoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
