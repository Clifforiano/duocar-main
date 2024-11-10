import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PruebaPageRoutingModule } from './prueba-routing.module';

import { PruebaPage } from './prueba.page';
import { share } from 'rxjs';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PruebaPageRoutingModule,
    SharedModule
  ],
  declarations: [PruebaPage]
})
export class PruebaPageModule {}
