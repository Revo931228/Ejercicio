import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMovimientosComponent } from './tipo-movimientos.component';

describe('TipoMovimientosComponent', () => {
  let component: TipoMovimientosComponent;
  let fixture: ComponentFixture<TipoMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoMovimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
