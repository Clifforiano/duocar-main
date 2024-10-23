import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class autoGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService, private router: Router) {}

async canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Promise<boolean> {
  const userId = this.firebaseService.getCurrentUserId();
  if (userId) {
    const carsSnapshot = await this.firebaseService.getAutosByUserId(userId);
    if (!carsSnapshot.empty) {
      // Si el usuario tiene un auto, no se redirige a ninguna página
      return true;
    } else {
      // Si el usuario no tiene un auto, redirige a otra página
      this.router.navigate(['/registro-vehiculo']); // Cambia la ruta a donde quieras redirigir si no tiene un auto
      return false;
    }
  } else {
    // Si no hay usuario autenticado, redirige a la página de login
    this.router.navigate(['/login']);
    return false;
  }
}
}