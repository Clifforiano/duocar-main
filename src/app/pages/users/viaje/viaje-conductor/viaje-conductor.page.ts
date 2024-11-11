import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-viaje-conductor',
  templateUrl: './viaje-conductor.page.html',
  styleUrls: ['./viaje-conductor.page.scss'],
})
export class ViajeConductorPage implements OnInit {
  pasajeros: any[] = [];  // Arreglo para almacenar los pasajeros del viaje

  constructor(private viajeService: ViajeService) {}

  ngOnInit() {
    const viajeId = 'a8Sm5vKnz2fJCbDtTmIf'; // Reemplaza esto con el ID del viaje que deseas consultar
    this.obtenerPasajerosDeViaje(viajeId);
  }

  // Método para obtener y listar los pasajeros del viaje
  obtenerPasajerosDeViaje(viajeId: string) {
    this.viajeService.getIdsPasajerosDeViaje(viajeId).subscribe(ids => {
      if (ids && ids.length > 0) {
        // Ahora busca los datos completos de cada pasajero
        this.pasajeros = [];
        ids.forEach(id => {
          this.viajeService.getUsuarioPorId(id).subscribe(pasajero => {
            if (pasajero) {
              this.pasajeros.push(pasajero);
            }
          });
        });
      } else {
        console.log('No hay pasajeros para este viaje.');
      }
    });
  }
  
}
