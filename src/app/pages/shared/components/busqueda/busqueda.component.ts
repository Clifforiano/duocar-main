import { Component, inject, OnInit } from '@angular/core';
import { NominatimService } from 'src/app/services/nominatim.service';
import { DireccionesService } from 'src/app/services/direcciones.service'; // Importa el servicio
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';


@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.scss'],
})
export class BusquedaComponent implements OnInit {


  busquedaForm : FormGroup;



  direccionesSvc=inject(DireccionesService) ;

  // Lista de campus de DUOC UC
  campusDuoc: any[] = [
    { nombre: 'Sede Antonio Varas', direccion: 'Antonio Varas 666, Providencia' },
    { nombre: 'Sede Maipú', direccion: 'Esquina Blanca 501, Maipú' },
    { nombre: 'Sede Melipilla', direccion: 'Serrano 1105, Melipilla' },
    { nombre: 'Sede Padre Alonso de Ovalle', direccion: 'Padre Alonso de Ovalle 1586, Santiago' },
    { nombre: 'Sede Plaza Oeste', direccion: 'Américo Vespucio 1501, Cerrillos' },
    { nombre: 'Sede Plaza Vespucio', direccion: 'Froilán Roa 7107, La Florida' },
    { nombre: 'Sede Plaza Norte', direccion: 'Calle Nueva 1660, Huechuraba' },
    { nombre: 'Sede Puente Alto', direccion: 'Av. San Carlos 1340, Puente Alto' },
    { nombre: 'Sede San Bernardo', direccion: 'Freire 897, San Bernardo' },
    { nombre: 'Sede San Carlos de Apoquindo', direccion: 'Camino El Alba 12881, Las Condes' },
    { nombre: 'Sede San Joaquín', direccion: 'Vicuña Mackenna 4917, San Joaquín' },
    { nombre: 'Sede Valparaíso', direccion: 'Brasil 2021, Valparaíso' },
    { nombre: 'Sede Viña del Mar', direccion: 'Álvarez 2336, Viña del Mar' },
    { nombre: 'Sede San Andrés de Concepción', direccion: 'Paicaví 3280, Concepción' },
    { nombre: 'Campus Arauco', direccion: 'Camino a Carampangue 1060, Arauco' },
    { nombre: 'Campus Villarrica', direccion: 'Anfión Muñoz 51, Villarrica' },
    { nombre: 'Sede Puerto Montt', direccion: 'Av. Egaña 651, Puerto Montt' }
  ];

  searchSubject: Subject<{ query: string, tipo: string }> = new Subject();
  // Variables para las direcciones de inicio y fin
  direccionInicio: string = '';
  direccionFin: string = '';

  // Resultados de búsqueda
  searchResultsInicio: any[] = [];
  searchResultsFin: any[] = [];

  constructor(private nominatimService: NominatimService, private formBuilder: FormBuilder) {

    this.busquedaForm = this.formBuilder.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
    });

    this.searchSubject.pipe(
      debounceTime(500), // Espera 500ms después de que el usuario deje de escribir
      distinctUntilChanged() // Solo continúa si el valor ha cambiado
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

  ngOnInit() {}

  // Método para seleccionar un campus de la lista
  seleccionarCampus(campus: any) {
    this.direccionInicio = campus.direccion; // Actualiza la dirección de inicio con la dirección seleccionada
  }

  // Método para realizar la búsqueda y actualizar los resultados según el campo (inicio o fin)
  onSearch(event: any, tipo: string) {
    const query = event.target.value;

    if (query.length > 2) {
      // Emitimos la búsqueda a través del Subject
      this.searchSubject.next({ query, tipo });
    } else {
      // Si la búsqueda tiene menos de 3 caracteres, limpiamos los resultados
      if (tipo === 'inicio') {
        this.searchResultsInicio = [];
      } else if (tipo === 'fin') {
        this.searchResultsFin = [];
      }
    }
  }


  // Método para manejar la selección de una dirección y ocultar la lista de resultados
  onSelectResult(result: any, tipo: string) {
    if (tipo === 'inicio') {
      this.direccionInicio = result.display_name; // Actualizar el input de inicio
      this.searchResultsInicio = []; // Ocultar lista de resultados
    } else if (tipo === 'fin') {
      this.direccionFin = result.display_name; // Actualizar el input de fin
      this.searchResultsFin = []; // Ocultar lista de resultados
    }
  }

  

    
 

  buscar(){
  console.log(this.direccionInicio, this.direccionFin);


  if (this.busquedaForm.valid) {
    this.direccionesSvc.guardarDirecciones(this.direccionInicio, this.direccionFin);
  }
}

}