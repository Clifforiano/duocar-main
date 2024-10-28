import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Reserva } from 'src/app/models/reserva.model';
import { Viaje } from 'src/app/models/viaje.model';
import { DateService } from 'src/app/services/date.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { NominatimService } from 'src/app/services/nominatim.service';
import { ViajeService } from 'src/app/services/viaje.service';


@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {

  
  //se crea el viaje

  nuevoViaje: Viaje = {
    id_viaje: '', 
    id_conductor: '',
    patente: '',
    fecha: '',
    precio: 0,
    dirrecionInicio: '',
    horaInicio: '',
    dirrecionFinal: '',
    horaFinal: '',
    estado: 'Iniciado',
    reservas: [
      {id_pasajero: '1', asiento: 2},
      {id_pasajero: '2', asiento: 3},

    ],
  };

  //VALORES VIAJE
   
  //ID CONDUCTOR
  cargarIdConductor() {
    this.nuevoViaje.id_conductor = this.fireBaseSvc.idusuario()
  }


  //PATENTE
cargarPatente(uid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    this.fireBaseSvc.getPatente(uid).subscribe(
      (patente) => {
        if (patente) {
          this.nuevoViaje.patente = patente.patente;
          resolve();
        } else {
          console.warn('No se encontró ninguna patente para este usuario.');
          reject('Patente no encontrada');
        }
      },
      (error) => {
        console.error('Error al cargar la patente:', error);
        reject(error);
      }
    );
  });
}

  //FECHA  Y HORA INICIO

  obtenerFechaHora() {
    const fecha = new Date();
   this.nuevoViaje.fecha = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
    this.nuevoViaje.horaInicio = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:${fecha.getSeconds().toString().padStart(2, '0')}`;
  }

  //PRECIO VIAJE
  cargarPrecioViaje() {
    this.nuevoViaje.precio =this.busquedaForm.get('precio')?.value;
  }

  //direccion INICIO y FINAL
  cargarDirecciones() {
    this.nuevoViaje.dirrecionInicio = this.busquedaForm.get('inicio')?.value;
    this.nuevoViaje.dirrecionFinal = this.busquedaForm.get('fin')?.value;
  }




  // Declaración de formulario
  busquedaForm: FormGroup;

  // Declaración de variables
  @Input() nombreBoton!: string;
  fechainicio: string;
  horainicio: string;
  precio_viaje: number;
  direccionInicio: string = '';
  direccionFin: string = '';
  direccionInicioSeleccionada: boolean = false; // Para habilitar el botón

  // Inyección de dependencias
  direccionesSvc = inject(DireccionesService);
  datesSvc = inject(DateService)
  fireBaseSvc = inject(FirebaseService)
  viajeSvc = inject(ViajeService)


  // Resultados de búsqueda
  searchResultsInicio: any[] = [];
  searchResultsFin: any[] = [];

  // Subject para la búsqueda
  searchSubject: Subject<{ query: string; tipo: string }> = new Subject();

  constructor(private nominatimService: NominatimService, private formBuilder: FormBuilder) {
    // Inicializa el formulario con validaciones
    this.busquedaForm = this.formBuilder.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      precio: [
        '',
        [Validators.required, Validators.min(1000), Validators.max(999999)]
      ],
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

  ngOnInit() {
    this.obtenerFechaHora();
    const uid = this.fireBaseSvc.idusuario(); // Obtén el UID del usuario actual
    if (uid) {
      this.cargarPatente(uid); // Cargar la patente del usuario
    } else {
      console.warn('No hay usuario autenticado.');
    }

    
    // No es necesario obtener la dirección actual aquí
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
  }
  async buscar() {
  

    if (this.busquedaForm.valid && this.direccionInicioSeleccionada) {
      // Cargar los valores del viaje
      this.cargarIdConductor();
      await this.cargarPatente(this.fireBaseSvc.idusuario()); // Asegúrate de manejar la suscripción correctamente
      this.obtenerFechaHora();
      this.cargarPrecioViaje();
      this.cargarDirecciones();
      
  
      // Luego, crea el viaje en la base de datos
      try {
        const viajeId = await this.viajeSvc.guardarViaje(this.nuevoViaje);
        console.log('Nuevo viaje creado con ID:', viajeId);
      } catch (error) {
        console.error('Error al crear el nuevo viaje:', error);
      }
    
  
    }
  }
  




}