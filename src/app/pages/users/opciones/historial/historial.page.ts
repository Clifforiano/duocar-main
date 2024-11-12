import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import {inject} from '@angular/core';
import {combineLatest, map} from 'rxjs';
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
    this.fireBaseSvc.getAuthState().subscribe(authState => {
      if (authState) {
        const userId = authState.uid;
  
        // Obtener historial como conductor
        const historialConductor$ = this.fireBaseSvc.ObtenerHistorial(userId);
  
        // Obtener historial como pasajero
        const historialPasajero$ = this.fireBaseSvc.obtenerHistorialPasajero(userId);
  
        // Combinar los resultados
        this.historial$ = combineLatest([historialConductor$, historialPasajero$]).pipe(
          map(([conductor, pasajero]) => {
            // Combina ambos historiales en uno solo
            return [...conductor, ...pasajero];
          })
        );
  
        // Suscribirse a la lista combinada
        this.historial$.subscribe(historial => {
          console.log('Historial combinado:', historial);
        });
      }
    });
  }}