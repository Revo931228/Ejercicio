import { TestBed } from '@angular/core/testing';

import { GeneracionxmlService } from './generacionxml.service';

describe('GeneracionxmlService', () => {
  let service: GeneracionxmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneracionxmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
