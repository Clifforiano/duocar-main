import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeConductorPage } from './viaje-conductor.page';

describe('ViajeConductorPage', () => {
  let component: ViajeConductorPage;
  let fixture: ComponentFixture<ViajeConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
