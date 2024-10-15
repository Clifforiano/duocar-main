import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialPasajeroPage } from './historial-pasajero.page';

describe('HistorialPasajeroPage', () => {
  let component: HistorialPasajeroPage;
  let fixture: ComponentFixture<HistorialPasajeroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorialPasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
