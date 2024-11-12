export interface HistorialViaje {
  tipoViaje: 'Conductor' | 'Pasajero';  // Indica si es un viaje de conductor o pasajero
  id_usuario: string;                    // ID del usuario (conductor o pasajero)
  precio: number;                        // Precio del viaje (como número)

  fecha: string | Date;                  // Fecha del viaje (puede ser string o Date)
  estado: string;                        // Estado del viaje (ej. 'finalizado', 'cancelado')
  reservas: number;                      // Número de reservas asociadas al viaje
  nomConductor: string;                  // Nombre del conductor
  dirrecionInicio: string;               // Dirección de inicio del viaje
  horaInicio: string;                    // Hora de inicio del viaje
  dirrecionFinal: string;                // Dirección final del viaje
  horaFinal: string;                     // Hora de finalización del viaje

  // Detalles del auto (se espera solo uno en este caso, puede adaptarse si es necesario más)
  auto: {
    marca: string;
    modelo: string;
    color: string;
    patente: string;
    nroasiento: number;
  };

  pasajeros?: string[];  // Solo si el viaje es de tipo "Conductor", la lista de pasajeros
}
