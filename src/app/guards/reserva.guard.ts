import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaGuard implements CanActivate {

  utilsSvc = inject(UtilsService);

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const estadoReserva = localStorage.getItem('estado_reserva_dato');

    if (estadoReserva === 'true') {
      // Si estado_reserva es true, redirigir al usuario
      this.router.navigate(['/home']); // Cambia '/otra-pagina' al destino que desees
      this.utilsSvc.presentToast({ 
        message: 'Ya tienes un viaje en curso', 
        color: 'danger', 
        duration: 2000, 
        position: 'middle', 
        icon: 'alert-circle-outline' 
      });
      return of(false); // Impide el acceso a la página
    }
    return of(true); // Permite el acceso si estado_reserva es false
  }
}