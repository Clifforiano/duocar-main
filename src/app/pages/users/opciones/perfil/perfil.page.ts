import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  formulario_perfil_pasajero: FormGroup;
  touchedNombre: boolean = false;
  touchedApellido: boolean = false;

  constructor(private formBuilder: FormBuilder) { 

    this.formulario_perfil_pasajero = this.formBuilder.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      apellido: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern("^[a-zA-Z]+$")
      ]]
    })

  }

  ngOnInit() {

  }

   
  

  cambiarnombre(){
    this.touchedNombre = true;
    if (this.formulario_perfil_pasajero.get('nombre')?.valid){
   const nombre = this.formulario_perfil_pasajero.get('nombre')?.value;
   console.log(nombre);
    }
    else{
      this.formulario_perfil_pasajero.get('nombre')?.markAsTouched();
    }
  }

  cambiarapellido(){
    this.touchedApellido = true;
    if (this.formulario_perfil_pasajero.get('apellido')?.valid){
    console.log(this.formulario_perfil_pasajero.value);
    }
    else{
      this.formulario_perfil_pasajero.get('apellido')?.markAsTouched();
    }
  }

}

