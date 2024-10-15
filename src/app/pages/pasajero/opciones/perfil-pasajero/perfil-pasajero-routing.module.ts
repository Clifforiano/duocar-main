import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPasajeroPage } from './perfil-pasajero.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPasajeroPageRoutingModule {}
