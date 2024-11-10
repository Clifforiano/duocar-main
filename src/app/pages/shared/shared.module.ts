import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHeaderComponent } from './components/c-header/c-header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusquedaComponent } from './components/busqueda/busqueda.component';




@NgModule({
  declarations: [CHeaderComponent,BusquedaComponent, ],
  exports: [CHeaderComponent,BusquedaComponent,],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],

})
export class SharedModule { }
