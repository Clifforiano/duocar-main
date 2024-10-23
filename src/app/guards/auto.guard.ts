import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class autoGuard implements CanActivate {


  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    // Espera a que Firebase devuelva el estado de autenticación
    const user = await firstValueFrom(this.firebaseService.getAuthState());

    if (user) {
      const userId = user.uid;
      const carsSnapshot = await this.firebaseService.getAutosByUserId(userId);
      
      // Verifica si el array de autos no está vacío
      if (carsSnapshot.length > 0) {
        // Si el usuario tiene al menos un auto, permite el acceso
        return true;
      } else {
        // Si no tiene autos, redirige al registro de vehículo
        this.router.navigate(['/registro-vehiculo']);
        return false;
      }
    } else {
      // Si no hay usuario autenticado, redirige al login
      this.router.navigate(['/login']);
      return false;
    }
  }
}