import { Component, OnInit } from '@angular/core';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-viaje-pasajero',
  templateUrl: './viaje-pasajero.page.html',
  styleUrls: ['./viaje-pasajero.page.scss'],
})
export class ViajePasajeroPage implements OnInit {

  coordsInicio: any;
  coordsFin: any;
  mapa: mapboxgl.Map;

  constructor() { }

  ngOnInit() {
    // Inicializar Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2xpZmZkdW9jIiwiYSI6ImNtM2J6a3ExeDA1dWMyanB3ZzZseWliczgifQ.9y1PTVPPEoLt6oWX9hEUAw'; // Reemplaza con tu token de Mapbox

    // Crear el mapa con un centro por defecto
    this.mapa = new mapboxgl.Map({
      container: 'map', // Contenedor donde se renderiza el mapa
      style: 'mapbox://styles/mapbox/streets-v11', // Estilo de mapa
      center: [-73.04825193012915, -36.80450716817647], // Coordenadas iniciales predeterminadas
      zoom: 14 // Nivel de zoom
    });

    // Recuperar las coordenadas almacenadas en localStorage
    const coordsInicio = localStorage.getItem('coordsInicio');
    const coordsFin = localStorage.getItem('coordsFin');
    
    if (coordsInicio) {
      try {
        this.coordsInicio = JSON.parse(coordsInicio);
        console.log('Coordenadas de inicio:', this.coordsInicio);
        
        // Colocar el marcador de inicio
        new mapboxgl.Marker()
          .setLngLat([this.coordsInicio.lng, this.coordsInicio.lat])
          .addTo(this.mapa);
      } catch (error) {
        console.error('Error al parsear las coordenadas de inicio:', error);
      }
    } else {
      console.log('No se encontraron coordenadas de inicio en localStorage');
    }

    if (coordsFin) {
      try {
        this.coordsFin = JSON.parse(coordsFin);
        console.log('Coordenadas de fin:', this.coordsFin);

        // Colocar el marcador de fin
        new mapboxgl.Marker()
          .setLngLat([this.coordsFin.lon, this.coordsFin.lat])
          .addTo(this.mapa);

        // Llamar a la función para dibujar la ruta
        this.dibujarRuta(this.coordsInicio, this.coordsFin);

      } catch (error) {
        console.error('Error al parsear las coordenadas de fin:', error);
      }
    } else {
      console.log('No se encontraron coordenadas de fin en localStorage');
    }
  }

  // Función para dibujar la ruta entre las coordenadas de inicio y fin
 // Función para dibujar la ruta entre las coordenadas de inicio y fin
dibujarRuta(inicio, fin) {
  const rutaUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${inicio.lng},${inicio.lat};${fin.lon},${fin.lat}?steps=true&geometries=geojson&access_token=pk.eyJ1IjoiY2xpZmZkdW9jIiwiYSI6ImNtM2J6a3ExeDA1dWMyanB3ZzZseWliczgifQ.9y1PTVPPEoLt6oWX9hEUAw`;

  fetch(rutaUrl)
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de la API:', data); // Ver la estructura de los datos

    if (data.routes && data.routes.length > 0) {
      const ruta = data.routes[0].geometry.coordinates;
      const rutaGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: ruta
            },
            properties: {}  // Propiedades vacías, si no las necesitas
          }
        ]
      };

      // Agregar la fuente de datos GeoJSON correctamente
      this.mapa.addSource('ruta', {
        type: 'geojson',
        data: rutaGeoJSON  // Asignar el objeto rutaGeoJSON directamente
      });

      // Añadir la capa para dibujar la ruta
      this.mapa.addLayer({
        id: 'ruta',
        type: 'line',
        source: 'ruta',
        paint: {
          'line-color': '#ff0000', // Color de la ruta
          'line-width': 5 // Grosor de la línea
        }
      });
    } else {
      console.error('No se encontraron rutas en la respuesta de la API');
    }
  })
  .catch(err => console.error('Error al obtener la ruta:', err));
}}