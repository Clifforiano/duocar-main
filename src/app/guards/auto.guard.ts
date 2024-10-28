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
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await firstValueFrom(this.firebaseService.getAuthState());
  
    if (user) {
      const userId = user.uid;
      const carsSnapshot = await this.firebaseService.getAutosByUserId(userId);
      
      if (carsSnapshot.length > 0) {
        return true;
      } else {
        this.router.navigate(['/registro-vehiculo']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }}