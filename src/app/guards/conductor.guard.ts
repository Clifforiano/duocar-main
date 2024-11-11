import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';  // Importa tu servicio
import { map, catchError, switchMap } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ConductorGuard implements CanActivate {

  utilsSvc = inject(UtilsService);

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.firebaseService.getAuthState().pipe(  // Usamos getAuthState en lugar de getCurrentUserId
      switchMap(authState => {
        if (authState) {
          const uid = authState.uid; // Obtenemos el UID del estado de autenticación
          return this.firebaseService.getEstadoConductor(uid).pipe( // Aquí resuelves el estado del conductor
            map(estado_conductor => {
              if (estado_conductor) {
                // Si el conductor ya tiene un viaje en curso, redirige a /home y muestra el mensaje
                this.router.navigate(['/home']);
                this.utilsSvc.presentToast({
                  message: 'Ya tienes un viaje en curso',
                  color: 'danger',
                  duration: 2000,
                  position: 'middle',
                  icon: 'alert-circle-outline'
                });
                return false; // Impide el acceso a la página
              }
              return true; // Permite el acceso si no hay viaje en curso
            }),
            catchError(() => {
              // Manejo de errores: redirige a /home y evita el acceso
              this.router.navigate(['/home']);
              return of(false);
            })
          );
        }

        // Si no hay usuario autenticado, redirige a /home y devuelve false
        this.router.navigate(['/home']);
        return of(false);
      })
    );
  }
}
