import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getFirestore,setDoc,doc, getDoc} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Auto } from '../models/auto.model';
import { Observable } from 'rxjs';
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



  //login
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //crear usuario

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }


  //actualizar usuario

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //recuperar contraseña
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  getAuthState(): Observable<any> {
    return this.auth.authState; // Retorna un observable del estado de autenticación
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

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data); 
  }

   async getDocument(path: string) {
    return  (await getDoc(doc(getFirestore(), path))).data();
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
  
  

  //obtener el id del usuario actual
  getCurrentUserId(): string | null {
    const user = getAuth().currentUser;
    return user ? user.uid : null;
  }

  constructor() { }


  }

  
