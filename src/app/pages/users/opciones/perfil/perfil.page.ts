import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userapellido: string;
  userName: string;
  userMail: string;



  constructor() { 

 

  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.nombre || 'Sin datos'; // Asigna el nombre o 'Invitado' si no existe
    this.userapellido = user.apellido || 'Sin datos';
    this. userMail = user.email || 'Sin datos';
    
  }

   
  


}

