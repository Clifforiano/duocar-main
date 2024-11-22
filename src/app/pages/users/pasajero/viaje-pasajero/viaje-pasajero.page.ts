import { Component, AfterViewInit, ViewChild ,OnInit} from '@angular/core';
import { MapaboxService } from 'src/app/services/mapabox.service';
import mapboxgl from 'mapbox-gl';
import { MapboxService } from 'src/app/services/mapbox.service';
import {inject} from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage implements OnInit, AfterViewInit {

  firebaseService = inject(FirebaseService);
  viajeSvc = inject(ViajeService);
  utilsSvc = inject(UtilsService);
  
  constructor(private mapaboxService: MapaboxService) {}

  id_viaje=''
  inicio: [number, number]
  fin: [number, number]
  estado_viaje='';
 
  ngOnInit() {
    this.id_viaje = localStorage.getItem('id_viaje') || '';
    console.log(this.id_viaje);
    this.estado_viaje= localStorage.getItem('estado_viaje') || '';

  this.getEstado();    

  }

 getEstado(){
 
    if (this.estado_viaje !== 'pendiente') {
      this.utilsSvc.presentToast({
        message: 'El viaje fue cancelado por el conductor.',
        color: 'danger',
        position: 'middle',
        duration: 2000,
        icon: 'close-circle-outline',
      })
      this.utilsSvc.routerLink('/home');
    }
 }

  ngAfterViewInit() {
    // Llamar al método buildMap después de que la vista haya sido cargada
    this.inicializarMapa();
  }

  // Método para inicializar el mapa
  async inicializarMapa() {
    // Crear y mostrar el cargador desde el utilsSvc
    const loading = await this.utilsSvc.loading();  
    await loading.present();  // Muestra el cargador

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

          this.inicio=coordsInicio;
          this.fin=coordsFin;

     
          // Llamar al servicio para trazar la ruta
          this.mapaboxService.obtenerRuta(map, this.inicio, this.fin)
            .then(() => {
              console.log('Ruta mostrada en el mapa');
              loading.dismiss();  // Ocultar el cargador cuando se muestra la ruta
            })
            .catch((error) => {
              console.error('Error al obtener la ruta:', error);
              loading.dismiss();  // Ocultar el cargador en caso de error
              this.utilsSvc.presentToast({
                message: 'Error al obtener la ruta: ' + error,
                color: 'danger',
                position: 'middle',
                duration: 2000,
                icon: 'close-circle-outline',
              })
            });
        } else {
          console.error('No se encontraron coordenadas en localStorage');
          loading.dismiss();  // Ocultar el cargador si no hay coordenadas
        }
      });
    } catch (error) {
      console.error('Error al inicializar el mapa', error);
      loading.dismiss();  // Ocultar el cargador en caso de error
      this.utilsSvc.presentToast({
        message: 'Error al inicializar el mapa: ' + error,
        color: 'danger',
        position: 'middle',
        duration: 2000,
        icon: 'close-circle-outline',
      })
    }
  }


  cancelar() {
    if (!this.id_viaje) {
      console.error('El ID del viaje está vacío');
      return;  // Salir si no hay un ID de viaje
    }
  
    this.firebaseService.eliminarPasajero(this.id_viaje, this.firebaseService.getCurrentUserId()).then(() => {
      this.viajeSvc.obtenerViajePorId(this.id_viaje).subscribe((viaje) => {
        this.viajeSvc.decrementarReserva(viaje);
        this.firebaseService.updateEstadoPasajero(this.firebaseService.getCurrentUserId(), 'neutro');
        this.firebaseService.cambiarEstadoReserva(this.firebaseService.getCurrentUserId(), false);
        localStorage.setItem('estado_pasajero', 'false');
        localStorage.setItem('estado', 'neutro');
      
        this.utilsSvc.presentToast({
          message: 'Viaje cancelado con exito.',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline',
        });
        this.utilsSvc.routerLink('home');
      });
    });
  }
  

}