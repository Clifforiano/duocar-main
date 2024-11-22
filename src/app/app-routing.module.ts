import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { autoGuard } from './guards/auto.guard';
import { RoleGuard } from './guards/role.guard';
import { ReservaGuard } from './guards/reserva.guard';
import { ConductorGuard } from './guards/conductor.guard';
import { LoginGuard } from './guards/login.guard';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  {
    path: 'login',
    loadChildren: () => import('./pages/login-register/login/login.module').then( m => m.LoginPageModule),
    

  },
  {
    path: 'register',
    loadChildren: () => import('./pages/login-register/register/register.module').then( m => m.RegisterPageModule)
  },
  
  {
    path: 'recuperar-clave',
    loadChildren: () => import('./pages/login-register/recuperar-clave/recuperar-clave.module').then( m => m.RecuperarClavePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/users/opciones/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/users/opciones/historial/historial.module').then( m => m.HistorialPageModule)
  },
  {
    path: 'conductor',
    loadChildren: () => import('./pages/users/conductor/conductor.module').then( m => m.ConductorPageModule),
    canActivate: [RoleGuard,ConductorGuard,autoGuard],
    data: {expectedRole: 'conductor'}
    
  },
  {
    path: 'pasajero',
    loadChildren: () => import('./pages/users/pasajero/pasajero.module').then( m => m.PasajeroPageModule),
    canActivate: [RoleGuard,ReservaGuard],
    data: {expectedRole: 'pasajero'}
    
  },
  {
    path: 'confirmacion',
    loadChildren: () => import('./pages/users/pasajero/confirmacion/confirmacion.module').then( m => m.ConfirmacionPageModule)
  },

  {
    path: 'viaje-pasajero',
    loadChildren: () => import('./pages/users/pasajero/viaje-pasajero/viaje-pasajero.module').then( m => m.ViajePasajeroPageModule)
  },
  {
    path: 'registro-vehiculo',
    loadChildren: () => import('./pages/users/opciones/registro-vehiculo/registro-vehiculo.module').then( m => m.RegistroVehiculoPageModule)
  },
  {
    path: 'viaje-conductor',
    loadChildren: () => import('./pages/users/viaje/viaje-conductor/viaje-conductor.module').then( m => m.ViajeConductorPageModule)
  },


  



 

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
