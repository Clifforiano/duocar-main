import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajePasajeroPageRoutingModule } from './viaje-pasajero-routing.module';

import { ViajePasajeroPage } from './viaje-pasajero.page';
import { share } from 'rxjs';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajePasajeroPageRoutingModule,
    SharedModule
  ],
  declarations: [ViajePasajeroPage]
})
export class ViajePasajeroPageModule {}
