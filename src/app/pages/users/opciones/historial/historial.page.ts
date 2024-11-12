import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import {inject} from '@angular/core';
@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  historial$: Observable<any[]>; // Observador para el historial de viajes
  fireBaseSvc = inject(FirebaseService)


  constructor(

  ) {}

  ngOnInit() {
    // Obtener el historial de viajes para el usuario logueado
    this.fireBaseSvc.getAuthState().subscribe(authState => {
      if (authState) {
        this.historial$ = this.fireBaseSvc.ObtenerHistorial(authState.uid); // Llamamos al método ObtenerHistorial
      }
    });
  }
}
