import { TestBed } from '@angular/core/testing';

import { FormCustomService } from './form-custom.service';

describe('FormCustomService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormCustomService = TestBed.get(FormCustomService);
    expect(service).toBeTruthy();
  });
});
