import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeConductorPage } from './viaje-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeConductorPageRoutingModule {}
