export interface HistorialViaje {
  id_historial: string;                  // ID del viaje en el historial
  precio: number;  
  id_conductor: string;    
  estado: string;                  // Precio del viaje (como número)

  fecha: string | Date;                  // Fecha del viaje (puede ser string o Date)
  nomconductor: string;                  // Nombre del conductor
  dirrecionInicio: string;               // Dirección de inicio del viaje
  horaInicio: string;                    // Hora de inicio del viaje
  dirrecionFinal: string;                // Dirección final del viaje
  horaFinal: string;                     // Hora de finalización del viaje

  pasajeros?: string[];  // Solo si el viaje es de tipo "Conductor", la lista de pasajeros
}
