import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  firebaseAuth = inject(AngularFireAuth);
  utilsSvc = inject(UtilsService);
  firebaseSvc: any = new FirebaseService();
  fireSvc = inject(FirebaseService);

  autos: any;
  isConnected: boolean = false;
  estado_conductor: boolean = false;
  estado_reserva: boolean = false;
  estadoactual: string = '';
  userName: string = ''; // Variable para almacenar el nombre del usuario
  networkListener: any; // Listener para cambios en la conexión

  constructor() { }

  async ngOnInit() {
    // Recuperar el objeto desde localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.nombre || 'Sin Datos'; // Asigna el nombre o 'Sin Datos' si no existe

    // Verificar el estado inicial de la red
    const status = await Network.getStatus();
    this.isConnected = status.connected;

    if (this.isConnected) {
      this.getDataFromServer();
    }
   

    // Escuchar cambios en el estado de la red
    this.networkListener = Network.addListener('networkStatusChange', (status) => {
      this.isConnected = status.connected;
      if (this.isConnected) {
        this.getDataFromServer();
      }
    });
  }

  ngOnDestroy() {
    // Eliminar el listener al destruir el componente
    if (this.networkListener) {
      this.networkListener.remove();
    }
  }

  getDataFromServer() {
    // Obtener datos del servidor y guardarlos en localStorage
    this.fireSvc.getAuthState().subscribe(user => {
      if (user) {
        // Obtener estado del conductor
 
        this.fireSvc.getEstadoConductor(user.uid).subscribe(estado => {
          this.estado_conductor = estado ?? false;
          localStorage.setItem('estado_conductor', this.estado_conductor?.toString());
        });
        
        this.fireSvc.getEstadoReserva(user.uid).subscribe(estado => {
          this.estado_reserva = estado;
          localStorage.setItem('estado_pasajero', this.estado_reserva?.toString());
        });

        // Obtener estado actual del usuario
        this.fireSvc.getEstadoOfCurrentUser().subscribe(estado => {
          this.estadoactual = estado;
          localStorage.setItem('estado', this.estadoactual);
        });

        // Obtener autos del usuario
        // Obtener autos del usuario
        this.fireSvc.getAutosByUserId(user.uid).then(autos => {
          const numAutos = autos.length;
          localStorage.setItem('numAutos-' + user.uid, numAutos.toString());
        });

        console.log('Datos obtenidos del servidor y guardados en localStorage');
        console.log('Estado del conductor:', localStorage.getItem('estado_conductor'));
        console.log('Estado de reserva:', localStorage.getItem('estado_pasajero'));
        console.log('Estado actual:', localStorage.getItem('estado'));
        console.log('Autos:', localStorage.getItem('numAutos-' + user.uid));
      }

    });
  }

  signOut() {
    this.fireSvc.signOut();
    localStorage.removeItem('user');
  }

  async irViaje() {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    switch (localStorage.getItem('estado')) {
      case 'conductor':
        this.utilsSvc.routerLink('/viaje-conductor');
        loading.dismiss();

        break;
      case 'pasajero':
        this.utilsSvc.routerLink('/viaje-pasajero');
        loading.dismiss();

        break;
      case 'neutro':
        this.utilsSvc.routerLink('/home');
        this.utilsSvc.presentToast({
          message: 'No tienes ningún viaje en curso',
          color: 'danger',
          duration: 2000,
          position: 'middle',
          icon: 'alert-circle-outline',
        });
        loading.dismiss();

        break;
      default:
        console.log(`Estado no reconocido: ${localStorage.getItem('estado')}`);
        loading.dismiss();
    }
    loading.dismiss();
  }

 async irConducir(){
    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.utilsSvc.routerLink('/conductor');
    loading.dismiss();
  

  }

  async irPasajero(){

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.utilsSvc.routerLink('/pasajero');
    loading.dismiss();

  }  


}
