// role.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  utilsSvc = inject(UtilsService);

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const estado = localStorage.getItem('estado_dato');
    const expectedRole = route.data['expectedRole'];

    if (estado === expectedRole || estado === 'neutro') {
      return of(true);
    } else {
      // Muestra un mensaje y redirige si el usuario tiene otro rol activo
      this.utilsSvc.presentToast({
        message: `En este momento tienes un viaje en curso como ${localStorage.getItem('estado_dato')}.`,
        duration: 1500,
        color: 'danger',
        position: 'middle'
      });
      this.router.navigate(['/home']);
      return of(false);
    }
  }
}