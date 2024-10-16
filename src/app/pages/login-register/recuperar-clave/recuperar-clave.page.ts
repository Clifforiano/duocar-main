import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.page.html',
  styleUrls: ['./recuperar-clave.page.scss'],
})
export class RecuperarClavePage implements OnInit {

  formulario_recuperar: FormGroup;
  hide: Boolean = true;



  firebaseSvc = inject(FirebaseService);
  utilsSvc=inject(UtilsService);


  constructor(private formBuilder: FormBuilder) {

    this.formulario_recuperar = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],

    })


  }

  ngOnInit() {
  }

  async ingresar() {

  const loading = await this.utilsSvc.loading();
  await loading.present();

    if (this.formulario_recuperar.valid) {
      this.firebaseSvc.sendRecoveryEmail(this.formulario_recuperar.value.email).then(res => {
        console.log(res);

        this.utilsSvc.presentToast({
          message: 'Correo enviado con exito',
          duration: 1500,
          color: 'success',
          position:'middle',
          icon: 'checkmark-circle-outline',
        })

        this.utilsSvc.routerLink('/login');
        this.formulario_recuperar.reset();
     
      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2000,
          color: 'danger',
          position:'middle',
          icon: 'alert-circle-outline',
        })


      }).finally(() => {  
        loading.dismiss();
      })
      
    }else {
      this.formulario_recuperar.markAllAsTouched();
      loading.dismiss();
    }
  }


}

