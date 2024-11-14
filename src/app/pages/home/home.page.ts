import { Component, inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

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


  constructor() { }

  ngOnInit() {
  }
  


  signOut() {
    this.firebaseSvc.signOut(); // Cambia 'singOut' a 'signOut'
  }

  estadoactual=""

  irViaje() {
    this.firebaseSvc.getEstadoOfCurrentUser().subscribe(estado => {

      this.estadoactual=estado
      localStorage.setItem('estado', this.estadoactual);

      switch (this.estadoactual) {
        case 'conductor':
          this.utilsSvc.routerLink('/viaje-conductor');
          break;
        case 'pasajero':
          this.utilsSvc.routerLink('/viaje-pasajero');
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
          break;
        default:
          console.log(`Estado no reconocido: ${estado}`);
      }
    });
  }

}
