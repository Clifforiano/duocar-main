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

  constructor() { }

  ngOnInit() {
  }

  signOut() {
    this.firebaseSvc.signOut(); // Cambia 'singOut' a 'signOut'
  }

  irViaje(){
    this.firebaseSvc.getEstadoOfCurrentUser().subscribe(estado => {
      if (estado === 'Conductor') {
        this.utilsSvc.routerLink('/viaje-conductor');
      } else if (estado === 'Pasajero') {
        this.utilsSvc.routerLink('/viaje-pasajero');
      }
    })
  }

}
