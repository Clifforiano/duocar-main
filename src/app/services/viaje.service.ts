import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from 'firebase/firestore';
import { Viaje } from '../models/viaje.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {


  constructor(private firestore: AngularFirestore) {}

  // Método para guardar un nuevo viaje
  guardarViaje(viaje: Viaje) {
    // Crea una referencia con ID automático
    const viajeRef: AngularFirestoreDocument<Viaje> = this.firestore.collection('viajes').doc();
    
    // Asigna el ID generado al viaje
    viaje.id_viaje = viajeRef.ref.id; 
    
    // Guarda el viaje con el ID generado
    return viajeRef.set({ ...viaje }) // Usa el operador de propagación para evitar referencias no deseadas
      .then(() => {
        console.log('Viaje guardado con ID:', viaje.id_viaje);
        return viaje.id_viaje; // Retorna el ID del viaje guardado si es necesario
      })
      .catch((error) => {
        console.error('Error al guardar el viaje:', error);
        throw error; // Lanza el error para manejarlo más adelante si es necesario
      });
  }

  // Método para obtener todos los viajes
  obtenerViajes() {
    return this.firestore.collection<Viaje>('viajes').valueChanges();
  }

//obtener reservas

loadReservas(viaje: Viaje): Observable<Reserva[]> {
  return this.firestore.collection<Reserva>('reservas', ref => ref.where('id_viaje', '==', viaje.id_viaje)).valueChanges();
}


}