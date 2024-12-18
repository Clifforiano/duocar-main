import { Component, AfterViewInit, ViewChild ,OnInit} from '@angular/core';
import { MapaboxService } from 'src/app/services/mapabox.service';
import mapboxgl from 'mapbox-gl';
import { MapboxService } from 'src/app/services/mapbox.service';
import {inject} from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Network } from '@capacitor/network';



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

  estado=''
 
  async ngOnInit() {
    this.id_viaje = localStorage.getItem('id_viaje') || '';
    console.log(this.id_viaje);

    
  }

  async ionViewWillEnter() {

    await Network.getStatus().then(status => {

      if (status.connected) {
        console.log('Conectado a internet');
       
      this.Cancelacion();
        
      }

      else {
        console.log('No conectado a internet');

      
        
      }
   
    });
    
  }

  Cancelacion(){
    this.firebaseService.getAuthState().subscribe(user => {
      if (user) {
        this.viajeSvc.getEstadoViaje(this.id_viaje).subscribe(estado => {
          this.estado=estado
          localStorage.setItem('estado_viaje_dato', this.estado.toString());
          if (this.estado!=='pendiente') {
            this.utilsSvc.routerLink('home');
            this.utilsSvc.presentToast({
              message: 'Viaje finalizado por el conductor',
              color: 'danger',
              duration: 2000,
              position: 'middle',
              icon: 'alert-circle-outline'

            })
          }
        });
      }
    });
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
            });
        } else {
          console.error('No se encontraron coordenadas en localStorage');
          loading.dismiss();  // Ocultar el cargador si no hay coordenadas
        }
      });
    } catch (error) {
      console.error('Error al inicializar el mapa', error);
      loading.dismiss();  // Ocultar el cargador en caso de error
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