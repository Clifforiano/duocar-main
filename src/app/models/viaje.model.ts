export interface Viaje {
    id: string;
    id_conductor: string;
    id_pasajero: string;
    id_vehiculo: string;
    fecha: string; // Si es una fecha, puedes usar 'Date' en lugar de 'string'
    precio: number; // Debe ser number si vas a hacer cálculos
    asiento: number;
    // Ubicación inicial
    latitudInicial: number; // Latitud debe ser de tipo number
    longitudInicial: number; // Longitud debe ser de tipo number
    horaInicio: Date; // Hora en formato de fecha
    // Ubicación final
    latitudFinal: number; // Latitud debe ser de tipo number
    longitudFinal: number; // Longitud debe ser de tipo number
    horaFinal: Date; // Hora en formato de fecha

    estado: string;
}
