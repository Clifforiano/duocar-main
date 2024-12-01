import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
singOut() {
  throw new Error('Method not implemented.');
}

lodingCtrl= inject(LoadingController)
toastCtrl=inject(ToastController)
router=inject(Router);

//loading

loading(){
  return this.lodingCtrl.create({
     spinner: 'crescent',
  })
}

//toast

async presentToast(opts?: ToastOptions) {
  const toast = await this.toastCtrl.create(opts)
  toast.present();
}

routerLink(url: string) {
  this.router.navigateByUrl(url);
}

saveLocalStore(key: string, value: any) {
  return localStorage.setItem(key, JSON.stringify(value))
}

getLocalStore(key:string){
return JSON.parse(localStorage.getItem(key))
}

}
