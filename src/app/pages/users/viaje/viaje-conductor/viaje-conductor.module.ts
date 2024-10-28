import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeConductorPageRoutingModule } from './viaje-conductor-routing.module';

import { ViajeConductorPage } from './viaje-conductor.page';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeConductorPageRoutingModule,
    SharedModule
  ],
  declarations: [ViajeConductorPage]
})
export class ViajeConductorPageModule {}
