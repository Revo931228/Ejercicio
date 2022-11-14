import { TestBed } from '@angular/core/testing';

import { RecibosservicesService } from './recibosservices.service';

describe('RecibosservicesService', () => {
  let service: RecibosservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecibosservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
