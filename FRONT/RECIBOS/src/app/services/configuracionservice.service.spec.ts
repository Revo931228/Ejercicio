import { TestBed } from '@angular/core/testing';

import { ConfiguracionserviceService } from './configuracionservice.service';

describe('ConfiguracionserviceService', () => {
  let service: ConfiguracionserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracionserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
