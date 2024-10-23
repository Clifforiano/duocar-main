import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHeaderComponent } from './components/c-header/c-header.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [CHeaderComponent ],
  exports: [CHeaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
  ],

})
export class SharedModule { }
