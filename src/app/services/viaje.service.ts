import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, FieldValue, Firestore, increment, updateDoc } from 'firebase/firestore';
import { Viaje } from '../models/viaje.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Auto } from '../models/auto.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  firebaseService: any;
  utilsSvc = inject(UtilsService)


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

incrementarReserva(viaje: Viaje): void {
  const auto = viaje.autos[0];

  if (viaje.reservas < auto.nroasiento) {
    viaje.reservas += 1;

    this.firestore.collection('viajes').doc(viaje.id_viaje).update({
      reservas: increment(1),
    });
  } else {
    this.utilsSvc.presentToast({
      message: 'No hay asientos disponibles',
      duration: 1500,
      color: 'danger',
      position: 'middle',
      icon: 'close-circle-outline',
    })
  }
}
  
decrementarReserva(viaje: Viaje): void {
  if (viaje.reservas > 0) {
    // Decrementa el contador de reservas si es mayor que cero
    viaje.reservas -= 1;
    // Aquí podrías guardar el cambio en Firebase o en tu base de datos
    this.utilsSvc.presentToast({
      message: 'Reserva eliminada con exito.',
      duration: 1500,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline',
    })
    // Lógica para guardar en Firebase o en la base de datos
    this.firestore.collection('viajes').doc(viaje.id_viaje).update({ reservas: viaje.reservas });
  } else {
    // Notificación si no hay reservas para eliminar
    // Agrega aquí el código para mostrar una notificación al usuario
    // Ejemplo: this.showNotification("No hay reservas para eliminar.");
  }
}


}