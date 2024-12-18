import { Auto } from "./auto.model";

export interface Viaje {
    id_viaje?: string;
    id_conductor: string;
    nom_conductor: string;
    fecha: string; // Si es una fecha, puedes usar 'Date' en lugar de 'string'
    precio: number; // Debe ser number si vas a hacer cálculos
    // Ubicación inicial
    dirrecionInicio: string;
    horaInicio: string; // Hora en formato de fecha
    // Ubicación final
    dirrecionFinal: string;
    horaFinal: string; // Hora en formato de fecha
    //hora_partida

    estado: string;
    autos: Auto[];   

    //reservas  
    reservas: number; 
    id_pasajero?: string[];
}
