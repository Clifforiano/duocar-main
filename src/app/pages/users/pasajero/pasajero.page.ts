import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Viaje } from 'src/app/models/viaje.model';
import { DateService } from 'src/app/services/date.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ViajeService } from 'src/app/services/viaje.service';
import { UtilsService } from 'src/app/services/utils.service';
import { MapboxService } from 'src/app/services/mapbox.service';  // Importa tu servicio Mapbox

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

  cantidad_asiento= 0;
  cantidad_reservas= 0;

  // Inyección de dependencias
  mapboxSvc = inject(MapboxService);
  datesSvc = inject(DateService);
  fireBaseSvc = inject(FirebaseService);
  viajeSvc = inject(ViajeService);
  utilsSvc = inject(UtilsService);

  // Resultados de búsqueda
  searchResultsInicio: any[] = [];
  searchResultsFin: any[] = [];
  viajesDisponibles: Viaje[] = [];

  // Subject para la búsqueda
  searchSubject: Subject<{ query: string; tipo: string }> = new Subject();

  constructor(private formBuilder: FormBuilder) {
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
      this.mapboxSvc.search(query).subscribe((results) => {
        if (tipo === 'inicio') {
          this.searchResultsInicio = results.features;
        } else if (tipo === 'fin') {
          this.searchResultsFin = results.features;
        }
      });
    });
  }

  ngOnInit() {


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
        this.direccionInicio = result.place_name;
        this.busquedaForm.get('inicio')?.setValue(this.direccionInicio);
        this.direccionInicioSeleccionada = true;
  
        // Verificar si las coordenadas existen en el resultado
        if (result.geometry && result.geometry.coordinates) {
          // Coordenadas en formato [lng, lat]
          const coordsInicio: [number, number] = [result.geometry.coordinates[0], result.geometry.coordinates[1]];
          localStorage.setItem('coordsInicio', JSON.stringify(coordsInicio)); // Guardamos las coordenadas en formato de tupla
          console.log('Coordenadas de inicio guardadas:', coordsInicio);  // Verifica que se guardaron correctamente
        } else {
          console.error('No se encontraron coordenadas para la dirección de inicio');
        }
      }
      this.searchResultsInicio = [];
    } else if (tipo === 'fin') {
      if (this.searchResultsFin.includes(result)) {
        this.direccionFin = result.place_name;
        this.busquedaForm.get('fin')?.setValue(this.direccionFin);
  
        // Verificar si las coordenadas existen en el resultado
        if (result.geometry && result.geometry.coordinates) {
          // Coordenadas en formato [lng, lat]
          const coordsFin: [number, number] = [result.geometry.coordinates[0], result.geometry.coordinates[1]];
          localStorage.setItem('coordsFin', JSON.stringify(coordsFin)); // Guardamos las coordenadas en formato de tupla
          console.log('Coordenadas de fin:', coordsFin); // Verifica si se guardan correctamente
        } else {
          console.error('No se encontraron coordenadas para la dirección de fin');
        }
      }
      this.searchResultsFin = [];
    }
  }
  

  async buscar() {
    const loading = await this.utilsSvc.loading();
    await loading.present();

    const inicio = this.busquedaForm.get('inicio')?.value;

    if (this.busquedaForm.valid) {
      this.viajeSvc.obtenerViajesFiltrados(inicio ).subscribe((viajes) => {
        this.viajesDisponibles = viajes.filter(viaje => viaje.estado === 'pendiente');
        if (this.viajesDisponibles.length === 0) {
          this.utilsSvc.presentToast({
            message: 'No hay viajes disponibles',
            duration: 3000,
            color: 'danger',
            position: 'middle',
          });
        }
        loading.dismiss();
      });
    }
  }

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
        this.viajeSvc.incrementarReserva(viaje);
        this.fireBaseSvc.updateEstadoToConductorForCurrentUser('pasajero');
        localStorage.setItem('id_viaje', viaje.id_viaje); // Cambia 'idViaje' por 'id_viaje'
        localStorage.setItem('estado_viaje', viaje.estado);
        

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
        this.utilsSvc.presentToast({
          message: 'No se puede realizar la reserva. No quedan cupos disponibles.',
          duration: 1500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      }
    } else {
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
