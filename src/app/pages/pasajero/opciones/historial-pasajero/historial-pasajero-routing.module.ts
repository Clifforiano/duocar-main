import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialPasajeroPage } from './historial-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialPasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialPasajeroPageRoutingModule {}
