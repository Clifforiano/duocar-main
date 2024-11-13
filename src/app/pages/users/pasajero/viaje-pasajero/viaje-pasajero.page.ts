import { Component, AfterViewInit, ViewChild ,OnInit} from '@angular/core';
import { MapaboxService } from 'src/app/services/mapabox.service';
import mapboxgl from 'mapbox-gl';
import { MapboxService } from 'src/app/services/mapbox.service';
import {inject} from '@angular/core';


@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage implements OnInit, AfterViewInit {

  constructor(private mapaboxService: MapaboxService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // Llamar al método buildMap después de que la vista haya sido cargada
    this.inicializarMapa();
  }

  // Método para inicializar el mapa
  async inicializarMapa() {
    try {
      // Crear el mapa
      const mapa = await this.mapaboxService.buildMap((map) => {
        // Este callback se ejecuta cuando el mapa se carga
        console.log('Mapa cargado', map);
        
        // Obtener las coordenadas desde localStorage
        const coordsInicioString = localStorage.getItem('coordsInicio');
        const coordsFinString = localStorage.getItem('coordsFin');
        
        if (coordsInicioString && coordsFinString) {
          const coordsInicio: [number, number] = JSON.parse(coordsInicioString);
          const coordsFin: [number, number] = JSON.parse(coordsFinString);
          
          // Llamar al servicio para trazar la ruta
          this.mapaboxService.obtenerRuta(map, coordsInicio, coordsFin)
            .then(() => {
              console.log('Ruta mostrada en el mapa');
            })
            .catch((error) => {
              console.error('Error al obtener la ruta:', error);
            });
        } else {
          console.error('No se encontraron coordenadas en localStorage');
        }
      });
    } catch (error) {
      console.error('Error al inicializar el mapa', error);
    }
  }
}