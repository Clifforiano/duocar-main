import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formulario_login: FormGroup;
  hide: Boolean = true;



  firebaseSvc = inject(FirebaseService);
  utilsSvc=inject(UtilsService);


  constructor(private formBuilder: FormBuilder) {

    this.formulario_login = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
      ]]
    })


  }

  ngOnInit() {
  }

  async ingresar() {

  const loading = await this.utilsSvc.loading();
  await loading.present();

    if (this.formulario_login.valid) {
      this.firebaseSvc.signIn(this.formulario_login.value as User).then(res => {
        console.log(res);

        this.getUserInfo(res.user.uid);

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
      this.formulario_login.markAllAsTouched();
      loading.dismiss();
    }
  }


  
  async getUserInfo(uid:String) {

    const loading = await this.utilsSvc.loading();
    await loading.present();
    

    if (this.formulario_login.valid) {
      let path='users/${uid}';

      this.firebaseSvc.getDocument(path).then(user => {
        this.utilsSvc.saveLocalStore('user',user);
        this.utilsSvc.routerLink('home');
        this.formulario_login.reset();

   


      }).catch(error => {
        console.log(error);




      }).finally(() => {  
        loading.dismiss();
      })
      
    }else {
      this.formulario_login.markAllAsTouched();
      loading.dismiss();
    }
  }



}
