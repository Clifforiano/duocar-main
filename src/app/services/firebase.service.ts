import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {getFirestore,setDoc,doc, getDoc} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);


  //autentificacion//


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

  //base de datos

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data); 
  }

   async getDocument(path: string) {
    return  (await getDoc(doc(getFirestore(), path))).data();
  }

  constructor() { }
}
