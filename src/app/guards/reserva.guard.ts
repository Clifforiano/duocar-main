import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';  // Importa tu servicio
import { map, catchError, switchMap } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaGuard implements CanActivate {

  utilsSvc = inject(UtilsService);

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Utiliza getAuthState para obtener el estado de autenticación
    return this.firebaseService.getAuthState().pipe(
      switchMap(authState => {
        if (authState) {
          const uid = authState.uid;  // Obtén el UID del authState
          return this.firebaseService.getEstadoReserva(uid).pipe(
            map(estado_reserva => {
              if (estado_reserva || localStorage.getItem('estado_pasajero') === 'true') {
                // Si estado_reserva es true, redirigir al usuario
                this.router.navigate(['/home']); // Cambia '/otra-pagina' al destino que desees
                this.utilsSvc.presentToast({ 
                  message: 'Ya tienes un viaje en curso', 
                  color: 'danger', 
                  duration: 2000, 
                  position: 'middle', 
                  icon: 'alert-circle-outline' 
                });
                return false; // Impide el acceso a la página
              }
              return true; // Permite el acceso si estado_reserva es false
            }),
            catchError(() => {
              // Manejo de errores
              this.router.navigate(['/home']); // Redirigir a home si hay algún error
              return of(false); // Devolver un observable que emite false
            })
          );
        } else {
          // Si no hay usuario autenticado, redirige a login
          this.router.navigate(['/login']);
          return of(false); // Devuelve un observable con false
        }
      }),
      catchError(() => {
        // Manejo de errores a nivel de getAuthState
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
