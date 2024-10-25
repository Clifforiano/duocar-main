import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private readonly storageKey = 'dates';

  guardarDates(horainicio: string, fechainicio: string) {
    const dates = { horainicio, fechainicio };
    localStorage.setItem(this.storageKey, JSON.stringify(dates));
  }
  
  // Método para obtener las direcciones de localStorage
  obtenerDates() {
    const datesGuardadas = localStorage.getItem(this.storageKey);
    if (datesGuardadas) {
      return JSON.parse( datesGuardadas );
    }
    return { horainicio: '', fechainicio: '' }; // Valores predeterminados si no hay direcciones
  }
  
  // Método para borrar las direcciones del localStorage
  borrarDates() {
    localStorage.removeItem(this.storageKey);
  }
  }