import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getFirestore,setDoc,doc, getDoc, updateDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Auto } from '../models/auto.model';
import { map, Observable } from 'rxjs';
import { Viaje } from '../models/viaje.model';
import {switchMap} from 'rxjs/operators'
import {of} from 'rxjs'
import { HistorialViaje } from '../models/historial.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc=inject(UtilsService);




  //autentificacion//

  getAuth() {
    return getAuth();
  }
 //usuario acutal

 //cambiar estado reserva usuario

 cambiarEstadoReserva(uid: string, estado_reserva: boolean) {
  const userRef = doc(getFirestore(), 'users', uid);
  return updateDoc(userRef, { estado_reserva });
}
//obtener id viaje
getPendingTripId() {
  return this.getAuthState().pipe(
    switchMap(user => {
      if (user) {
        // Filtra los viajes que estén en estado "pendiente" y que pertenezcan al usuario autenticado
        return this.firestore.collection<User>('viajes', ref => 
          ref.where('estado', '==', 'pendiente').where('id_conductor', '==', user.uid)
        ).get();
      } else {
        // Si no hay usuario autenticado, retorna un Observable vacío
        return of(null);
      }
    }),
    map(querySnapshot => {
      if (querySnapshot) {
        const pendingTrip = querySnapshot.docs[0];
        return pendingTrip ? pendingTrip.id : null; // Retorna el ID si hay un viaje "pendiente"
      }
      return null;
    })
  );
}


//cambiar estado viaje finalizado-cancelado-pendiente

cambiarEstadoViaje(viajeId: string, estado: string) {
  const viajeRef = doc(getFirestore(), 'viajes', viajeId);
  return updateDoc(viajeRef, { estado });
}

//cambiar hora fin viaje
cambiarHoraFinViaje(viajeId: string, horaFin: string) {
  const viajeRef = doc(getFirestore(), 'viajes', viajeId);
  return updateDoc(viajeRef, { horaFinal: horaFin });
}


  //login
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //crear usuario

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
// cambiar estado

  //actualizar usuario

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //recuperar contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  getAuthState(): Observable<any> {
    return this.auth.authState.pipe(
      map(authState => {
        const userData = this.utilsSvc.getLocalStore('user');
        return authState && userData ? authState : null; // Retorna el objeto authState si ambos están presentes, si no retorna null
      })
    );
  }

  

  //cerrar sesion

  async signOut() {
    try {
      await this.getAuth().signOut();
      localStorage.removeItem('user'); // Opcional si manejas datos adicionales
      this.utilsSvc.routerLink('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
  //base de datos

  setDocument(path: string, data: any, p0: { merge: boolean; }) {
    return setDoc(doc(getFirestore(), path), data); 
  }

   async getDocument(path: string) {
    return  (await getDoc(doc(getFirestore(), path))).data();
  }
//obtener nombre de usuario

getUserName() {
  const user = getAuth().currentUser;
  if (user) {
      console.log('Usuario autenticado:', user.displayName);
      return user.displayName; 
  } else {
      console.log('No hay usuario autenticado.');
      return null; // O un valor por defecto
  }
}
//cambiar estado

updateEstadoToConductorForCurrentUser(estado : string) {
  this.auth.currentUser.then(user => {
    if (user) {
      const uid = user.uid;
      this.firestore.collection('users').doc(uid).update({
        estado: estado
      }).then(() => {
        console.log('Estado del usuario actualizado a conductor');
      }).catch((error) => {
        console.error('Error al actualizar el estado:', error);
      });
    } else {
      console.log('No hay usuario autenticado');
    }
  });
}

//cambiar estado pasajero

updateEstadoPasajero(uid: string, estado: string) {
  this.firestore.collection('users').doc(uid).update({
    estado: estado
  }).then(() => {
    console.log('Estado del pasajero actualizado');
  }).catch((error) => {
    console.error('Error al actualizar el estado:', error);
  });
}

//obtener cantidad pasajeros por viaje
obtenerPasajeros(viajeId: string) {
  return this.firestore.collection('pasajeros', ref => ref.where('id_viaje', '==', viajeId)).get();
}


//obtener estado

getEstadoOfCurrentUser(): Observable<string | null> {
  return new Observable(observer => {
    this.auth.currentUser.then(user => {
      if (user) {
        const uid = user.uid;
        this.firestore.collection<User>('users').doc(uid).get().subscribe(doc => {
          if (doc.exists) {
            const data = doc.data() as User; // Usa el tipo User
            observer.next(data.estado || null); // Devuelve el estado del usuario o null si no existe
          } else {
            observer.next(null); // Si no existe el documento
          }
        }, error => {
          console.error('Error al consultar el estado:', error);
          observer.next(null); // Manejo de error
        });
      } else {
        observer.next(null); // No hay usuario autenticado
      }
    });
  });
}


  //autos

  //crear auto
  async createAuto(auto: Auto) {
    return await this.firestore.collection('autos').add(auto);
  }

  //obtener autos de un usuario
  async getAutosByUserId(userId: string): Promise<Auto[]> {
    const snapshot = await this.firestore
      .collection<Auto>('autos', ref => ref.where('uid', '==', userId))
      .get().toPromise();
  
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Auto[];
  }


  

  //obtener patente
  getPatente(uid: string): Observable<Auto | undefined> {
    return this.firestore.collection<Auto>('autos', ref => ref.where('uid', '==', uid).limit(1)).valueChanges().pipe(
      map(patentes => patentes[0]) // Obtiene el primer auto (si existe)
    );
  }

  //obtener el id del usuario actual
  getCurrentUserId(): string | null {
    const user = getAuth().currentUser;
    return user ? user.uid : null;
  }

  idusuario(){
    return getAuth().currentUser?.uid;

  
  }
  //obtener nombre de usuario
  // Método para obtener el estado del usuario actual
  getUserState(uid: string): Observable<string | null> {
    return this.firestore
      .collection<User>('users')
      .doc(uid)
      .valueChanges()
      .pipe(map((user) => user?.estado || null));
  }
  constructor() { }


// Obtener el estado de reserva del usuario actual
getEstadoReserva(uid: string): Observable<boolean | null> {
  return this.firestore
    .collection<User>('users')
    .doc(uid)
    .valueChanges()
    .pipe(map((user) => user?.estado_reserva || null));
}

//obtener estado de viaje actual

//metodo para obtener el estado del conductor
getEstadoConductor(uid: string): Observable<boolean | null> {
  return this.firestore
    .collection<User>('users')
    .doc(uid)
    .valueChanges()
    .pipe(map((user) => user?.estado_conductor || null));
}
  
//cambiar estado reserva
updateEstadoReserva(uid: string, estado_reserva: boolean): Promise<void> {
  const userRef = this.firestore.collection('users').doc(uid);  // Referencia al documento del usuario en Firestore

  return userRef.update({
    estado_reserva: estado_reserva,  // Actualiza solo el campo estado_reserva
  })
  .then(() => {
    console.log(`Estado de reserva de usuario ${uid} actualizado a: ${estado_reserva}`);
  })
  .catch(error => {
    console.error('Error al actualizar estado_reserva: ', error);
  });
}

// Método para actualizar el estado_conductor de un usuario
updateEstadoConductor(uid: string, estado_conductor: boolean): Promise<void> {
  const userRef = this.firestore.collection('users').doc(uid);  // Referencia al documento del usuario en Firestore

  return userRef.update({
    estado_conductor: estado_conductor,  // Actualiza solo el campo estado_conductor
  })
  .then(() => {
    console.log(`Estado de conductor de usuario ${uid} actualizado a: ${estado_conductor}`);
  })
  .catch(error => {
    console.error('Error al actualizar estado_conductor: ', error);
  });
}

//updateEstadoViaje

updateEstadoViaje(viajeId: string, estado_viaje: string) {
  const viajeRef = this.firestore.collection('viajes').doc(viajeId);

  return viajeRef.update({
    estado_viaje: estado_viaje
  }).then(() => {
    console.log(`Estado del viaje ${viajeId} actualizado a: ${estado_viaje}`);
  })
  .catch(error => {
    console.error('Error al actualizar el estado del viaje: ', error);
  });
}


agregarPasajero(viajeId: string) {
  this.getAuthState().subscribe(authState => {
    if (authState) {
      const idPasajero = authState.uid;  // Usamos el UID del usuario autenticado como el ID del pasajero

      const viajeRef = doc(this.firestore.firestore, 'viajes', viajeId);  // Referencia al documento de viaje

      // Obtener el viaje actual y agregar el ID del pasajero
      getDoc(viajeRef).then(viajeDoc => {
        if (viajeDoc.exists()) {
          const currentViaje = viajeDoc.data() as Viaje;
          
          // Evitar agregar un ID duplicado
          if (!currentViaje.id_pasajero?.includes(idPasajero)) {
            currentViaje.id_pasajero.push(idPasajero);
          }

          // Actualizar el viaje en Firestore
          updateDoc(viajeRef, {
            id_pasajero: currentViaje.id_pasajero
          }).then(() => {
            console.log('Pasajero agregado con éxito');
          }).catch(err => {
            console.error('Error al actualizar el viaje:', err);
          });
        }
      }).catch(err => {
        console.error('Error al obtener el viaje:', err);
      });
    } else {
      console.log('Usuario no autenticado');
    }
  });
}

 // Método para obtener los usuarios por un array de IDs
  obtenerUsuariosPorIds(ids: string[]): Observable<User[]> {
    // Realizamos la consulta para obtener los usuarios por los IDs
    return this.firestore
      .collection('usuarios', ref => ref.where('uid', 'in', ids))
      .valueChanges({ idField: 'uid' }) // Aseguramos que se incluya el campo 'uid'
      .pipe(
        // Mapeamos el resultado para asegurarnos de que la respuesta tenga el tipo correcto
        map((usuarios: any[]) => {
          return usuarios.map(usuario => ({
            ...usuario, // Nos aseguramos de que se conserven las propiedades
            uid: usuario.uid || '', // Si no existe 'uid', le asignamos un valor vacío
          }));
        })
      );
  }


//historial
// Obtener los viajes del historial del usuario logueado



ObtenerHistorial(uid: string): Observable<HistorialViaje[]> {
  return this.firestore.collection<HistorialViaje>('viajahistorial', ref => 
    ref.where('id_conductor', '==', uid)
  ).valueChanges();
}

// Obtener viajes como pasajero
obtenerHistorialPasajero(uid: string): Observable<HistorialViaje[]> {
  return this.firestore.collection<HistorialViaje>('viajahistorial', ref => 
    ref.where('pasajeros', 'array-contains', uid)
  ).valueChanges();
}

// En tu servicio de Firebase
getConductorIds(): Observable<string[]> {
  return this.firestore.collection('viajahistorial').get().pipe(
    map(snapshot => {
      const conductorIds = new Set<string>();
      snapshot.forEach(doc => {
        const data = doc.data() as HistorialViaje;  // Aquí indicamos que el tipo es HistorialViaje
        if (data.id_conductor) {
          conductorIds.add(data.id_conductor); // Agrega el ID del conductor
        }
      });
      return Array.from(conductorIds); // Convierte el Set a un Array
    })
  );
}

//quitar usuarios de reserva vijea
eliminarPasajero(idViaje: string, idPasajero: string): Promise<void> {
  const viajeRef = this.firestore.collection('viajes').doc(idViaje);
  
  return viajeRef.get().toPromise().then(docSnapshot => {
    if (docSnapshot.exists) {
      const viajeData = docSnapshot.data() as Viaje;
      const idPasajeros = viajeData.id_pasajero || [];

      // Filtramos el array de pasajeros para eliminar el pasajero con el id dado
      const nuevosPasajeros = idPasajeros.filter(id => id !== idPasajero);

      // Actualizamos el documento con el nuevo array de pasajeros
      return viajeRef.update({
        id_pasajero: nuevosPasajeros
      });
    } else {
      throw new Error('Viaje no encontrado');
    }
  });
}


agregarAlHistorialPorId(viajeId: string): Observable<void> {
  return new Observable(observer => {
    // Obtener el estado de autenticación del usuario logueado
    this.getAuthState().pipe(
      switchMap(authState => {
        if (!authState) {
          observer.error('Usuario no autenticado');
          return [];
        }

        const userId = authState.uid; // Obtener el UID del usuario logueado

        // Obtener el viaje completo usando el ID del viaje
        return this.firestore.collection('viajes').doc(viajeId).valueChanges();
      }),
      map((viaje: any) => {
        if (!viaje) {
          observer.error('Viaje no encontrado');
          return;
        }

        // Crear el objeto para el historial basado en el nuevo modelo
        const historialViaje: HistorialViaje = {
          id_historial: viajeId,  // Usando el ID del viaje como historial ID
          precio: viaje.precio,
          id_conductor: viaje.id_conductor,
          fecha: viaje.fecha,
          estado: viaje.estado,
          nomconductor: viaje.nom_conductor,
          dirrecionInicio: viaje.dirrecionInicio,
          horaInicio: viaje.horaInicio,
          dirrecionFinal: viaje.dirrecionFinal,
          horaFinal: viaje.horaFinal,
          pasajeros: viaje.id_pasajero,  // Solo si el viaje tiene pasajeros
        };

        // Verificar si el viaje ya existe en la colección 'viajahistorial'
        this.firestore.collection('viajahistorial').ref.where('id_historial', '==', viajeId).get().then(querySnapshot => {
          if (querySnapshot.docs.length > 0) {
            // El viaje ya existe, actualizarlo
            const docRef = querySnapshot.docs[0].ref;
            this.firestore.collection('viajahistorial').doc(docRef.id).update(historialViaje)
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch(error => {
                observer.error('Error al actualizar el historial: ' + error);
              });
          } else {
            // El viaje no existe, agregarlo a la colección 'viajahistorial'
            this.firestore.collection('viajahistorial').add(historialViaje)
              .then(() => {
                observer.next();
                observer.complete();
              })
              .catch(error => {
                observer.error('Error al agregar al historial: ' + error);
              });
          }
        });
      })
    ).subscribe();
  });
}
}