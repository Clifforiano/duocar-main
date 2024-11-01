import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, forkJoin, map, Observable, Subject, switchMap } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';
import { Viaje } from 'src/app/models/viaje.model';
import { DateService } from 'src/app/services/date.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NominatimService } from 'src/app/services/nominatim.service';
import { ReservaService } from 'src/app/services/reserva.service';
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
  reservaSvc= inject(ReservaService)
  utilsSvc = inject(UtilsService);


  // Resultados de búsqueda
  searchResultsInicio: any[] = [];
  searchResultsFin: any[] = [];
  viajesDisponibles: Viaje[] = [];

  //reseva coleccion

  reservas: Reserva[] = [];

  //obtener id viaje
  obtenerIdViaje(): Observable<void> {
    return this.viajeSvc.obtenerIdFiltrados(this.direccionInicio, this.direccionFin).pipe(
      map((viajes) => {
        // Filtrar los viajes que no tienen estado 'terminado'
        this.nuevareserva.id_viaje = viajes[0].id_viaje;
      })
    );
  }
 
  //obtener id pasajero
  obtenerIdPasajero() {
   this.nuevareserva.id_pasajero = this.fireBaseSvc.getCurrentUserId();
  }

  //obtener nro asiento

  obtenerAsiento(asiento: number) {
    this.nuevareserva.asiento = this.asientoSeleccionado = asiento;
  }

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
        this.viajesDisponibles = viajes.filter(viaje => viaje.estado !== 'terminado');
        console.log(this.viajesDisponibles);
        loading.dismiss();
      });

    }
    
  }

  nuevareserva : Reserva = {
    id_reserva: '',
    id_pasajero: '',
    id_viaje: '',
    asiento: 0
  }
  reservar() {
    this.obtenerIdPasajero();
    
    // Llama a obtenerIdViaje y cualquier otra función que devuelva un Observable
    forkJoin([
      this.obtenerIdViaje(),
      // Otras llamadas que necesites
    ]).subscribe(() => {
      this.obtenerAsiento(this.asientoSeleccionado);
      this.reservaSvc.guardarReserva(this.nuevareserva);
      console.log(this.nuevareserva);
    });
  }
}