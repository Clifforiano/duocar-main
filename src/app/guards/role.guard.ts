// role.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

    utilsSvc=inject(UtilsService);

  constructor(private auth: AngularFireAuth, private userService: FirebaseService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      switchMap((user) => {
        if (user) {
          return this.userService.getUserState(user.uid).pipe(
            map((estado) => {
              const expectedRole = route.data['expectedRole'];
              if (estado === expectedRole || estado === 'neutro') {
                return true;
              } else {
                this.utilsSvc.presentToast({ message: 'En este momento tienes un viaje en curso como ' + estado + '.', duration: 1500, color: 'danger', position: 'middle' });
                this.router.navigate(['/home']);
                
                return false;
              }
            })
          );
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
}
