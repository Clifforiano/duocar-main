import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin, map, Observable, Subject, switchMap } from 'rxjs';
import { Viaje } from 'src/app/models/viaje.model';
import { DateService } from 'src/app/services/date.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NominatimService } from 'src/app/services/nominatim.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-pasajero',
  templateUrl: './pasajero.page.html',
  styleUrls: ['./pasajero.page.scss'],
})
export class PasajeroPage implements OnInit {

  // Declaración de formulario
  busquedaForm: FormGroup;

  // Declaración de variables
  @Input() nombreBoton!: string;
  precio_viaje: number;
  direccionInicio: string = '';
  direccionFin: string = '';
  direccionInicioSeleccionada: boolean = false; // Para habilitar el botón

  // Inyección de dependencias
  direccionesSvc = inject(DireccionesService);
  datesSvc = inject(DateService)
  fireBaseSvc = inject(FirebaseService)
  viajeSvc = inject(ViajeService)
  utilsSvc = inject(UtilsService);


  // Resultados de búsqueda
  searchResultsInicio: any[] = [];
  searchResultsFin: any[] = [];
  viajesDisponibles: Viaje[] = [];

  //reseva coleccion

  utils: any;

  //obtener id viaje

 
  //obtener id pasajero

  //obtener nro asiento

  // Subject para la búsqueda
  searchSubject: Subject<{ query: string; tipo: string }> = new Subject();

  constructor(private nominatimService: NominatimService, private formBuilder: FormBuilder) {
    // Inicializa el formulario con validaciones
    this.busquedaForm = this.formBuilder.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
    });

    // Suscribirse al Subject para buscar resultados
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(({ query, tipo }) => {
      this.nominatimService.search(query).subscribe((results) => {
        if (tipo === 'inicio') {
          this.searchResultsInicio = results;
        } else if (tipo === 'fin') {
          this.searchResultsFin = results;
        }
      });
    });
  }
  //asientos

  asientoSeleccionado: number | undefined; // Guarda el asiento seleccionado


  asientoPlaceholder: string = 'Selecciona tu asiento';

  ngOnInit() {

  }

  // Nueva función para obtener la dirección actual al hacer clic en el icono
  obtenerDireccionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.nominatimService.search(`${latitude}, ${longitude}`).subscribe((results) => {
          if (results && results.length > 0) {
            this.direccionInicio = results[0].display_name;
            this.busquedaForm.get('inicio')?.setValue(this.direccionInicio); // Actualiza el formulario
            this.direccionInicioSeleccionada = true; // Marca que la dirección de inicio es válida
          }
        });
      }, (error) => {
        console.error("Error al obtener la geolocalización:", error);
      });
    } else {
      console.error("La geolocalización no está soportada en este navegador.");
    }
  }

  onSearch(event: any, tipo: string) {
    const query = event.target.value;

    if (query.length > 2) {
      this.searchSubject.next({ query, tipo });
    } else {
      if (tipo === 'inicio') {
        this.searchResultsInicio = [];
      } else if (tipo === 'fin') {
        this.searchResultsFin = [];
      }
    }
  }


  


  onSelectResult(result: any, tipo: string) {

        
    if (tipo === 'inicio') {
      if (this.searchResultsInicio.includes(result)) {
        this.direccionInicio = result.display_name;
        this.busquedaForm.get('inicio')?.setValue(this.direccionInicio); // Actualiza el formulario
        this.direccionInicioSeleccionada = true; // Marca que la dirección de inicio es válida
      }
      this.searchResultsInicio = [];
    } else if (tipo === 'fin') {
      if (this.searchResultsFin.includes(result)) {
        this.direccionFin = result.display_name;
        this.busquedaForm.get('fin')?.setValue(this.direccionFin); // Actualiza el formulario
      }
      this.searchResultsFin = [];
    }
  } async buscar() {
    
    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    const inicio = this.busquedaForm.get('inicio')?.value;
    const fin = this.busquedaForm.get('fin')?.value;

    if (this.busquedaForm.valid) {
      
      this.viajeSvc.obtenerViajesFiltrados(inicio, fin).subscribe((viajes) => {
        // Filtrar los viajes que no tienen estado 'terminado'
        this.viajesDisponibles = viajes.filter(viaje => viaje.estado === 'pendiente');
        if (this.viajesDisponibles.length === 0) {
         this.utilsSvc.presentToast({
           message: 'No hay viajes disponibles',
           duration: 3000 ,
           color: 'danger',
           position:'middle',
         })
        }
        loading.dismiss();
      });
    }
    }
    
//obtener id pasajero

 obtenerIdPasajero() {
  const user = this.fireBaseSvc.getAuth().currentUser;
  if (user) {
    return user.uid;
  }
  return null;
}



reservar(viaje: Viaje) {
  const idPasajero = this.obtenerIdPasajero();


  if (idPasajero) {
    const auto = viaje.autos[0];
    if (viaje.reservas < auto.nroasiento) {
      // Llamamos al método incrementarReserva del servicio
      this.viajeSvc.incrementarReserva(viaje);
      this.fireBaseSvc.updateEstadoToConductorForCurrentUser('pasajero');

      // Muestra un mensaje de éxito
      this.utilsSvc.presentToast({
        message: 'Reserva realizada con éxito.',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
      this.fireBaseSvc.cambiarEstadoReserva(idPasajero, true);
      this.utilsSvc.routerLink('/viaje-pasajero');
      this.fireBaseSvc.agregarPasajero(viaje.id_viaje);

    } else {
      // Muestra un mensaje de error si no hay cupos disponibles
      this.utilsSvc.presentToast({
        message: 'No se puede realizar la reserva. No quedan cupos disponibles.',
        duration: 1500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }
  } else {
    // Muestra un mensaje si el usuario no está autenticado
    this.utilsSvc.presentToast({
      message: 'No se pudo realizar la reserva. Inicia sesión primero.',
      duration: 1500,
      color: 'danger',
      position: 'middle',
      icon: 'alert-circle-outline',
    });
  }
}


}
