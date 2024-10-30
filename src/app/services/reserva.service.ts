import { Injectable } from '@angular/core';
import { Reserva } from '../models/reserva.model';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor() { }

 crearReserva(reserva: Reserva) {
  return addDoc(collection(getFirestore(), 'reservas'), reserva);
 }

  
}
