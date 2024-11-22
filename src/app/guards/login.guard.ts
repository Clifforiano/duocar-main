import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.firebaseService.getAuthState().pipe(
      map(authState => {
        if (authState) {
          // Si el usuario está logeado, redirige al home
          this.router.navigate(['/home']);
          return false;
        } else {
          // Si no está logeado, redirige al login
          this.router.navigate(['/login']);
          return true;
        }
      })
    );
  }
}