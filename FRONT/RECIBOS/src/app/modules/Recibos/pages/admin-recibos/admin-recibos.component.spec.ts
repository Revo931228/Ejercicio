import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecibosComponent } from './admin-recibos.component';

describe('AdminRecibosComponent', () => {
  let component: AdminRecibosComponent;
  let fixture: ComponentFixture<AdminRecibosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRecibosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRecibosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
