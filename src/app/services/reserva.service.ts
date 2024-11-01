import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  firebaseService: any;
  firestore: any;

  constructor() { }

  // Método para guardar una reserva en Firestore
  guardarReserva(reserva: Reserva) {
    const reservasRef = collection(getFirestore(), 'reservas');

    return addDoc(reservasRef, {
        id_pasajero: reserva.id_pasajero,
        id_viaje: reserva.id_viaje,
    }).then(async (docRef) => {
        // Actualizar la reserva con el ID generado
        const updatedReserva = { ...reserva, id_reserva: docRef.id };

        // Actualizar el documento en Firestore con el ID
        await setDoc(doc(reservasRef, docRef.id), updatedReserva);

        console.log("Reserva guardada con ID:", updatedReserva.id_reserva);
        return updatedReserva; // Devolver la reserva con el ID incluido
    }).catch((error) => {
        console.error("Error al guardar la reserva: ", error);
        throw error;
    });
}
}