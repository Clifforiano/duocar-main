import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from 'firebase/firestore';
import { Viaje } from '../models/viaje.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Reserva } from '../models/reserva.model';
import { Auto } from '../models/auto.model';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  firebaseService: any;


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


obtenerViajesFiltrados(inicio: string, fin: string): Observable<Viaje[]> {
  return this.firestore
    .collection<Viaje>('viajes', ref =>
      ref.where('dirrecionInicio', '==', inicio).where('dirrecionFinal', '==', fin)
    )
    .valueChanges();
}


obtenerIdFiltrados(inicio: string, fin: string): Observable<{ id_viaje: string }[]> {
  return this.firestore
    .collection<Viaje>('viajes', ref =>
      ref.where('dirrecionInicio', '==', inicio).where('dirrecionFinal', '==', fin)
    )
    .get()
    .pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({ id_viaje: doc.id })); // Devuelve un objeto con la propiedad id_viaje
      })
    );
}



obtenerAutoPorPatente(patente: string): Observable<Auto | undefined> {
  return this.firestore
    .collection<Auto>('autos', (ref) => ref.where('patente', '==', patente))
    .valueChanges()
    .pipe(
      map((autos) => autos[0]) // Obtén el primer auto que coincida con la patente
    );
}


private destino = new BehaviorSubject<string | null>(null);
destino$ = this.destino.asObservable();

setDestino(direccion: string) {
  this.destino.next(direccion);
}

}