export interface Viaje {
    id_viaje: string;
    id_conductor: string;
    id_pasajero: string;
    patente: string;
    fecha: Date; // Si es una fecha, puedes usar 'Date' en lugar de 'string'
    precio: number; // Debe ser number si vas a hacer cálculos
    asiento: number;
    // Ubicación inicial
    dirrecionInicio: string;
    horaInicio: string; // Hora en formato de fecha
    // Ubicación final
    dirrecionFinal: string;
    horaFinal: string; // Hora en formato de fecha

    estado: string;
}
