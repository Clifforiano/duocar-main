import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ConductorGuard implements CanActivate {

  utilsSvc = inject(UtilsService);

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const estadoConductor = localStorage.getItem('estado_conductor_dato');

    if (estadoConductor === 'true') {
      // Si el conductor ya tiene un viaje en curso, redirige a /home y muestra el mensaje
      this.router.navigate(['/home']);
      this.utilsSvc.presentToast({
        message: 'Ya tienes un viaje en curso',
        color: 'danger',
        duration: 2000,
        position: 'middle',
        icon: 'alert-circle-outline'
      });
      return of(false); // Impide el acceso a la página
    }
    return of(true); // Permite el acceso si no hay viaje en curso
  }
}