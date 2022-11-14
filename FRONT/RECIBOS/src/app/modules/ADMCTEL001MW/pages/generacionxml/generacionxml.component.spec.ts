import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionxmlComponent } from './generacionxml.component';

describe('GeneracionxmlComponent', () => {
  let component: GeneracionxmlComponent;
  let fixture: ComponentFixture<GeneracionxmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneracionxmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionxmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
