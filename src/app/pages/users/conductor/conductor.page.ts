import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { DateService } from 'src/app/services/date.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { NominatimService } from 'src/app/services/nominatim.service';


@Component({
  selector: 'app-conductor',
  templateUrl: './conductor.page.html',
  styleUrls: ['./conductor.page.scss'],
})
export class ConductorPage implements OnInit {
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
   datesSvc = inject(DateService);
 
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
       precio: ['', Validators.required, Validators.min(1), Validators.max(4)],
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
 
   buscar() {
     console.log(this.direccionInicio, this.direccionFin);
     console.log(this.horainicio, this.fechainicio);
 
     if (this.busquedaForm.valid && this.direccionInicioSeleccionada) {
       this.direccionesSvc.guardarDirecciones(this.direccionInicio, this.direccionFin);
       this.datesSvc.guardarDates(this.horainicio, this.fechainicio);
     } else {
       console.error("Una o ambas direcciones no son válidas.");
     }
   }
 
   obtenerFechaHora() {
     const fecha = new Date();
     this.fechainicio = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
     this.horainicio = `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:${fecha.getSeconds().toString().padStart(2, '0')}`;
   }
 }