import { TestBed } from '@angular/core/testing';

import { RepventascarteraserviceService } from './repventascarteraservice.service';

describe('RepventascarteraserviceService', () => {
  let service: RepventascarteraserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepventascarteraserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
