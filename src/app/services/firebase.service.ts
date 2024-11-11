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
import { from } from 'rxjs';

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


// Método para obtener los viajes que no estén finalizados
getViajesNoFinalizados(): Observable<Viaje[]> {
  return this.firestore.collection<Viaje>('viajes', ref => 
    ref.where('estado', '!=', 'finalizado')  // Filtra viajes cuyo estado no sea 'finalizado'
  ).valueChanges();
}

// Método para obtener los viajes de un usuario específico que no estén finalizados
getViajesNoFinalizadosPorUsuario(uid: string): Observable<Viaje[]> {
  return this.firestore.collection<Viaje>('viajes', ref => 
    ref.where('uid', '==', uid)  // Filtra por el ID del usuario
    .where('estado', '!=', 'finalizado')  // Filtra viajes cuyo estado no sea 'finalizado'
  ).valueChanges();
}

// Método para cambiar el estado de un viaje  // Método para cambiar el estado de un viaje
  updateEstadoViaje(viajeId: string, estado: string): Promise<void> {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId);
    return from(viajeRef.update({ estado })).toPromise(); // Convierte el resultado de `update` a una promesa
  }


}

