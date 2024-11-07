import { inject, Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UtilsService } from './utils.service';
import { Viaje } from '../models/viaje.model';
import * as firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  constructor(private firestore: AngularFirestore) {}

  utilsSvc = inject(UtilsService);


  // Método para guardar una reserva en Firestore
  async guardarReserva(reserva: Reserva) {
    try {
      // Verificar si hay asientos disponibles antes de proceder con la reserva
      const hayAsientos = await this.verificarAsientosDisponibles(reserva.id_viaje);
      if (!hayAsientos) {
        throw new Error('No se pueden realizar reservas. No quedan asientos disponibles.');
      }

      const reservasRef = collection(getFirestore(), 'reservas');

      // Crear la reserva en Firestore
      const docRef = await addDoc(reservasRef, {
        id_pasajero: reserva.id_pasajero,
        id_viaje: reserva.id_viaje,
      });

      // Actualizar la reserva con el ID generado
      const updatedReserva = { ...reserva, id_reserva: docRef.id };
      await setDoc(doc(reservasRef, docRef.id), updatedReserva);

      console.log("Reserva guardada con ID:", updatedReserva.id_reserva);

      // Llamar al método para restar un asiento en el auto asociado al id_viaje de la reserva
      await this.restarAsientoEnViaje(reserva.id_viaje);

      return updatedReserva; // Devolver la reserva con el ID incluido

    } catch (error) {
      console.error("Error al guardar la reserva: ", error);
      throw error; // Propagar el error para que el componente pueda manejarlo
    }
  }

  // Método para verificar si hay asientos disponibles en el viaje
  async verificarAsientosDisponibles(idViaje: string): Promise<boolean> {
    try {
      const viajeDocRef = this.firestore.collection('viajes').doc(idViaje);
      const viajeDoc = await viajeDocRef.ref.get();

      if (viajeDoc.exists) {
        const viajeData = viajeDoc.data();
        const autos = viajeData && viajeData['autos'];

        if (autos && autos.length > 0) {
          // Verificar si al menos un auto tiene asientos disponibles
          for (const auto of autos) {
            if (auto.nroasiento > 0) {
              return true; // Hay al menos un asiento disponible
            }
          }
        }
      }
      return false; // No hay asientos disponibles

    } catch (error) {
      console.error('Error al verificar asientos disponibles:', error);
      throw error;
    }
  }

  // Método para restar 1 al número de asientos en la lista de autos de un viaje
  async restarAsientoEnViaje(idViaje: string): Promise<void> {
    try {
      const viajeDocRef = this.firestore.collection('viajes').doc(idViaje);
      const viajeDoc = await viajeDocRef.ref.get();

      if (viajeDoc.exists) {
        const viajeData = viajeDoc.data();
        const autos = viajeData && viajeData['autos'];

        if (autos && autos.length > 0) {
          for (let i = 0; i < autos.length; i++) {
            if (autos[i].nroasiento > 0) {
              autos[i].nroasiento -= 1;
              await viajeDocRef.update({ autos });
              console.log(`Asiento actualizado correctamente para el auto con UID: ${autos[i].uid}`);
              break;
            }
          }
        } else {
          console.log('No hay autos disponibles en este viaje.');
        }
      } else {
        console.log('El documento del viaje no existe.');
      }
    } catch (error) {
      console.error('Error al actualizar el número de asientos:', error);
    }
  }



}