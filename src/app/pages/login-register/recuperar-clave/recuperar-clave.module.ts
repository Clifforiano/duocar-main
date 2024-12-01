import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarClavePageRoutingModule } from './recuperar-clave-routing.module';

import { RecuperarClavePage } from './recuperar-clave.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarClavePageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [RecuperarClavePage]
})
export class RecuperarClavePageModule {}
