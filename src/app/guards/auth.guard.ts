import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';

export class AuthGuard implements CanActivate {

firebaseSvc=inject(FirebaseService);
utilsSvc=inject(UtilsService);

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
   
  let user= localStorage.getItem('user');

  return new Promise((resolve) => {
    this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
     if (auth) {
      if (user) resolve(true);
     } 
     else {
      this.utilsSvc.routerLink('login');
      resolve(false);
     }
    })
  });
}}

   

  




