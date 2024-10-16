import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  {
    path: 'login',
    loadChildren: () => import('./pages/login-register/login/login.module').then( m => m.LoginPageModule)
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
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/users/opciones/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/users/opciones/historial/historial.module').then( m => m.HistorialPageModule)
  },  {
    path: 'conductor',
    loadChildren: () => import('./pages/users/conductor/conductor.module').then( m => m.ConductorPageModule)
  },
  {
    path: 'pasajero',
    loadChildren: () => import('./pages/users/pasajero/pasajero.module').then( m => m.PasajeroPageModule)
  }



 

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
