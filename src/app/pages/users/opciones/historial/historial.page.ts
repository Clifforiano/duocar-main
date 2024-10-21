import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  viajes: Array<any>;
  constructor() { 
    this.viajes = [
      {
        conductor: 'Juan Pérez',
        precio: '15,000 CLP',
        asiento: 'A3',
        automovil: {
          marca: 'Toyota',
          modelo: 'Corolla',
          color: 'Verde'
        },
        fecha: '20/10/2024',
        hora: '14:30',
        tipoUsuario: 'Estudiante'
      },
      {
        conductor: 'Ana López',
        precio: '18,500 CLP',
        asiento: 'B5',
        automovil: {
          marca: 'Hyundai',
          modelo: 'Elantra',
          color: 'Rojo'
        },
        fecha: '21/10/2024',
        hora: '16:45',
        tipoUsuario: 'Adulto'
      }
    ];

  }

  ngOnInit() {
  }

}
