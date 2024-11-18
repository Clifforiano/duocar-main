import { Component, OnInit, inject } from '@angular/core';
import { Viaje } from 'src/app/models/viaje.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-viaje-conductor',
  templateUrl: './viaje-conductor.page.html',
  styleUrls: ['./viaje-conductor.page.scss'],
})
export class ViajeConductorPage implements OnInit {
  public pasajeros: any[] = [];  // Arreglo para almacenar los pasajeros del viaje
  private cachedUsuarios: { [id: string]: any } = {}; // Cache para los usuarios obtenidos


  utilsSvc = inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  constructor(private viajeService: ViajeService) {

  }

  viajeid = ""
  n_conductor = ""
  precio : any
  fecha = ""
  hora_inicio = ""
  direccion_inicio = ""
  direccion_final = ""
  reservas= 0

  ngOnInit() {

    const storedViaje = localStorage.getItem('viajeconductor');
    if (storedViaje) {
      // Convertir el JSON a un objeto
      const viajeconductor: Viaje = JSON.parse(storedViaje);
    
      // Acceder a propiedades específicas
      this.n_conductor = viajeconductor.nom_conductor;
      this.precio = viajeconductor.precio;
      this.fecha = viajeconductor.fecha;
      this.hora_inicio = viajeconductor.horaInicio;
      this.direccion_inicio = viajeconductor.dirrecionInicio;
      this.direccion_final = viajeconductor.dirrecionFinal;

    }

  

    // Obtener el ID del viaje pendiente para el usuario autenticado
    this.firebaseSvc.getPendingTripId().subscribe(viajeId => {
      if (viajeId) {
        // Si se encontró un viaje pendiente, obtener los pasajeros
        this.obtenerPasajerosDeViaje(viajeId);
        this.viajeid = viajeId

        this.viajeService.obtenerReservas(this.viajeid).subscribe(reservas => {
          this.reservas = reservas
        });

      } else {
        console.log('No hay un viaje pendiente para el usuario autenticado.');

      }
    });
  }



  //obtener hora sistema
  obtenerHoraSistema() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`; // Retorna un string en formato "hh:mm:ss"
  }

  // Método para obtener y listar los pasajeros del viaje
  async obtenerPasajerosDeViaje(viajeId: string) {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Verificar el estado del viaje antes de continuar
    this.viajeService.getEstadoViaje(viajeId).subscribe(
      async estado => {
        if (estado === 'pendiente') {
          // Solo proceder a obtener los pasajeros si el viaje está en estado "pendiente"
          this.viajeService.getIdsPasajerosDeViaje(viajeId).subscribe(
            ids => {
              if (ids && ids.length > 0) {
                this.pasajeros = [];
                ids.forEach(id => {
                  // Verificar si el usuario ya está en cache
                  if (this.cachedUsuarios[id]) {
                    this.pasajeros.push(this.cachedUsuarios[id]);
                  } else {
                    // Si no está en cache, hacer la solicitud y guardarlo en cache
                    this.viajeService.getUsuarioPorId(id).subscribe(pasajero => {
                      if (pasajero) {
                        this.cachedUsuarios[id] = pasajero; // Guardar en cache
                        this.pasajeros.push(pasajero);
                      }
                    });
                  }
                });
              } else {
                console.log('No hay pasajeros para este viaje.');
              }
            },
            error => {
              console.error('Error al cargar los IDs de pasajeros:', error);
            }
          );
        } else {
          console.log('El viaje ya no está en estado pendiente.');
          this.pasajeros = [];  // Limpiar la lista de pasajeros si el viaje no está pendiente
        }
        loading.dismiss();
      },
      error => {
        console.error('Error al obtener el estado del viaje:', error);
        loading.dismiss();
      }
    );
  }


  async cancelarViaje() {
    // Actualizar historial y estado del viaje
    await this.firebaseSvc.agregarAlHistorialPorId(this.viajeid).subscribe();
    await this.firebaseSvc.cambiarEstadoViaje(this.viajeid, 'cancelado');
    await this.firebaseSvc.cambiarHoraFinViaje(this.viajeid, this.obtenerHoraSistema());
    await this.firebaseSvc.updateEstadoToConductorForCurrentUser('neutro');
    await this.firebaseSvc.updateEstadoConductor(this.firebaseSvc.idusuario(), false);

    // Recorrer todas las IDs y acceder a los datos de cada usuario
    Object.keys(this.cachedUsuarios).forEach(id => {
      const usuario = this.cachedUsuarios[id];
      console.log(`ID: ${id}, Usuario:`, usuario);
      this.firebaseSvc.updateEstadoPasajero(id, 'neutro');
      this.firebaseSvc.cambiarEstadoReserva(id, false);
    });
    // Navegar al home y mostrar el toast de éxito
    this.utilsSvc.routerLink('home');
    this.utilsSvc.presentToast({
      message: 'Viaje cancelado con éxito',
      color: 'success',
      position: 'middle',
      duration: 2000,
      icon: 'checkmark-circle-outline',
    });
  }


 async terminar() {
     // Actualizar historial y estado del viaje
     await this.firebaseSvc.agregarAlHistorialPorId(this.viajeid).subscribe();
     await this.firebaseSvc.cambiarEstadoViaje(this.viajeid, 'finalizado');
     await this.firebaseSvc.cambiarHoraFinViaje(this.viajeid, this.obtenerHoraSistema());
     await this.firebaseSvc.updateEstadoToConductorForCurrentUser('neutro');
     await this.firebaseSvc.updateEstadoConductor(this.firebaseSvc.idusuario(), false);
 
     // Recorrer todas las IDs y acceder a los datos de cada usuario
     Object.keys(this.cachedUsuarios).forEach(id => {
       const usuario = this.cachedUsuarios[id];
       console.log(`ID: ${id}, Usuario:`, usuario);
       this.firebaseSvc.updateEstadoPasajero(id, 'neutro');
       this.firebaseSvc.cambiarEstadoReserva(id, false);
     });
     // Navegar al home y mostrar el toast de éxito
     this.utilsSvc.routerLink('home');
     this.utilsSvc.presentToast({
      message: 'Viaje fue finalizado con éxito',
       color: 'success',
       position: 'middle',
       duration: 2000,
       icon: 'checkmark-circle-outline',
     });
   }
 }

