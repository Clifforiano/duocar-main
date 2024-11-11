import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formulario_register: FormGroup;
  hide: Boolean = true;



  firebaseSvc = inject(FirebaseService);
  utilsSvc=inject(UtilsService);


  constructor(private formBuilder: FormBuilder) {

    this.formulario_register = this.formBuilder.group({

      uid: ['', [
        
      ]],

      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      apellido: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern("^[a-zA-Z]+$")
      ]],
      estado: ['neutro', []  
      ]
    })


  }

  
  
  ngOnInit() {
  }

  async registrar() {

    const loading = await this.utilsSvc.loading();
    await loading.present();

    if (this.formulario_register.valid) {



      this.firebaseSvc.signUp(this.formulario_register.value as User).then(res => {
        let uid = res.user.uid;
        this.formulario_register.controls['uid'].setValue(uid);
        this.firebaseSvc.updateUser(this.formulario_register.value['nombre']);
        this.setUserInfo(uid);
        console.log(res);

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
      this.formulario_register.markAllAsTouched();
      loading.dismiss();
    }
  }


  async setUserInfo(uid: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();
  
    if (this.formulario_register.valid) {
      const path = `users/${uid}`; // Uso de backticks
  
      // Elimina la contraseña antes de guardar
      delete this.formulario_register.value['password'];
  
      // Asegúrate de que el método setDocument esté configurado correctamente
      this.firebaseSvc.setDocument(path, this.formulario_register.value, { merge: true })
        .then(async res => {
          this.utilsSvc.saveLocalStore('user', this.formulario_register.value);
          this.utilsSvc.routerLink('/home');
          this.formulario_register.reset();
          console.log(res);
        })
        .catch(error => {
          console.error(error);
          this.utilsSvc.presentToast({
            message: error.message,
            duration: 2000,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    } else {
      loading.dismiss();
    }
  }
 

}
