import { Component, inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auto } from 'src/app/models/auto.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registro-vehiculo',
  templateUrl: './registro-vehiculo.page.html',
  styleUrls: ['./registro-vehiculo.page.scss'],
})
export class RegistroVehiculoPage implements OnInit {

  autoForm: FormGroup;
  autos: Auto[] = [];

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private afAuth: AngularFireAuth
  ) {
    this.autoForm = this.fb.group({
      patente: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      color: ['', Validators.required],
      nroasiento: [null, [Validators.required, Validators.min(1), Validators.max(4)]],
    });
  }

  ngOnInit() {
    this.loadUserAutos();
  }

  async loadUserAutos() {
    const userId = this.firebaseService.getCurrentUserId();
    if (userId) {
      this.autos = await this.firebaseService.getAutosByUserId(userId);
    }
  }

  async onSubmit() {
    if (this.autoForm.valid) {
      const uid = this.firebaseService.getCurrentUserId();

      const auto: Auto = {
        uid: uid!,
        patente: this.autoForm.value.patente,
        marca: this.autoForm.value.marca,
        modelo: this.autoForm.value.modelo,
        color: this.autoForm.value.color,
        nroasiento: this.autoForm.value.nroasiento,
      };

      try {
        await this.firebaseService.createAuto(auto);
        this.autoForm.reset();
        await this.loadUserAutos(); // Recargar la lista de autos
      } catch (error) {
        console.error('Error al registrar el auto:', error);
      }
    }
  }
}