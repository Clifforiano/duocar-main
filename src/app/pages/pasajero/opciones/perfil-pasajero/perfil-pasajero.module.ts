import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPasajeroPageRoutingModule } from './perfil-pasajero-routing.module';

import { PerfilPasajeroPage } from './perfil-pasajero.page';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPasajeroPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [PerfilPasajeroPage]
})
export class PerfilPasajeroPageModule {}
