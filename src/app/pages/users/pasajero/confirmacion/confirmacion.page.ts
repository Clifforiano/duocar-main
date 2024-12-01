import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {

  formulario_asiento: FormGroup;
  asientoPlaceholder: string = 'Selecciona tu asiento';

  // Definir asientos de forma estática para poder cambiar más adelante
  asientos = [
    { value: 1, label: 'Asiento nro: 1' },
    { value: 2, label: 'Asiento nro: 2' },
    { value: 3, label: 'Asiento nro: 3' },
    { value: 4, label: 'Asiento nro: 4' }
  ];



  constructor(private formBuilder: FormBuilder) {

    this.formulario_asiento = this.formBuilder.group({
      asiento: ['', Validators.required]
    });
   }


  ngOnInit() {
  }

}
