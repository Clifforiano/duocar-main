import { Component, inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Network } from '@capacitor/network';
import { ViajeService } from 'src/app/services/viaje.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseAuth = inject(AngularFireAuth);
  utilsSvc = inject(UtilsService);
  firebaseSvc: any = new FirebaseService();
  fireSvc=inject(FirebaseService)
  viajeSvc=inject(ViajeService)
  isOnline: boolean;
  estado_conductor: boolean = false;

  constructor() { }

  async ionViewWillEnter() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.nombre || 'Sin Datos'; // Asigna el nombre o 'Invitado' si no existe

    await Network.getStatus().then(status => {



      if (status.connected) {
        console.log('Conectado a internet');
        //obtener estados:
       this.fireSvc.getAuthState().subscribe(user => {
         if (user) {
          //rescatar estado
           this.fireSvc.getEstadoOfCurrentUser().subscribe(estado => {
             this.estadoactual=estado
            localStorage.setItem('estado_dato', this.estadoactual);
           });
           //rescatar estado_conductor
           this.viajeSvc.getEstadoConductor(user.uid).subscribe(estado_conductor => {
           this.estado_conductor=estado_conductor
           localStorage.setItem('estado_conductor_dato', this.estado_conductor.toString());
           console.log(localStorage.getItem('estado_conductor_dato'));
          });

          //rescatar estado reserva
          this.viajeSvc.getEstadoReserva(user.uid).subscribe(estado_reserva => {
            localStorage.setItem('estado_reserva_dato', estado_reserva.toString());
            console.log(localStorage.getItem('estado_reserva_dato'));
          });

        

         }
         
       })
      

      } else {
        console.log('No hay conexión a internet');
        this.estadoactual=localStorage.getItem('estado_dato')


      }
    });
    
  }




  ngOnInit() {
  
  }
  userName: string = ''; // Variable para almacenar el nombre del usuario


  signOut() {
    this.fireSvc.signOut();
    localStorage.removeItem('user');
    }

  estadoactual="" 




 async irViaje() {
   
  const loading = await this.utilsSvc.loading();
  await loading.present();


      switch (localStorage.getItem('estado_dato')) {
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
            icon: 'alert-circle-outline'
          });
          loading.dismiss();

          break;
        default:
          console.log(`Estado no reconocido: ${localStorage.getItem('estado_dato')}`);
          loading.dismiss();

      }
  
  }

}
