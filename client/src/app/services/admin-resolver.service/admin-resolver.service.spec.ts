import { TestBed } from '@angular/core/testing';

import { AdminResolverService } from './admin-resolver.service';

describe('AdminResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminResolverService = TestBed.get(AdminResolverService);
    expect(service).toBeTruthy();
  });
});
