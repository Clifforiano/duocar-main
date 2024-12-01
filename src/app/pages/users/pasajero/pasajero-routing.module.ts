import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasajeroPage } from './pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: PasajeroPage
  },
  {
    path: 'confirmacion',
    loadChildren: () => import('./confirmacion/confirmacion.module').then( m => m.ConfirmacionPageModule)
  },  {
    path: 'viaje-pasajero',
    loadChildren: () => import('./viaje-pasajero/viaje-pasajero.module').then( m => m.ViajePasajeroPageModule)
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasajeroPageRoutingModule {}
