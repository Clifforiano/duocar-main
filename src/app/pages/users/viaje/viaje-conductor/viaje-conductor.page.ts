import { Component, inject, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-viaje-conductor',
  templateUrl: './viaje-conductor.page.html',
  styleUrls: ['./viaje-conductor.page.scss'],
})
export class ViajeConductorPage implements OnInit {

  utilsSvc=inject(UtilsService);

  usuarios = [

  ];

  

  eliminarUsuario(index: number) {
    this.usuarios.splice(index, 1); // Eliminar el usuario de la lista
  }

  confirmarViaje() {
    const usuariosSeleccionados = this.usuarios.filter((usuario) => usuario.seleccionado);
    console.log('Usuarios confirmados:', usuariosSeleccionados);
    // Lógica adicional para confirmar el viaje, como enviar los datos al servidor
    this.utilsSvc.presentToast({
      message: 'Viaje Finalizado',
      duration: 1500,
      color: 'success',
      position:'middle',
      icon: 'checkmark-circle-outline',
    });
  }

  cancelarViaje() {
    this.usuarios.forEach((usuario) => (usuario.seleccionado = false)); // Desmarcar todos
    console.log('Viaje cancelado');
    // Lógica adicional para cancelar el viaje
  }

  ngOnInit() {
    const viajeId = 'ID_DEL_VIAJE';
  }

}
