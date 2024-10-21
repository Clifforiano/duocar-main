import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.page.html',
  styleUrls: ['./confirmacion.page.scss'],
})
export class ConfirmacionPage implements OnInit {

  constructor() { }

  formulario_asiento: FormGroup = new FormGroup({
    asiento: new FormControl('', [Validators.required])
  });
  ngOnInit() {
  }

}
