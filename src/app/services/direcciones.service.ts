import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  private readonly storageKey = 'direcciones';

  constructor() { }
// Método para guardar direcciones en localStorage
guardarDirecciones(direccionInicio: string, direccionFin: string) {
  const direcciones = { direccionInicio, direccionFin };
  localStorage.setItem(this.storageKey, JSON.stringify(direcciones));
}

// Método para obtener las direcciones de localStorage
obtenerDirecciones() {
  const direccionesGuardadas = localStorage.getItem(this.storageKey);
  if (direccionesGuardadas) {
    return JSON.parse(direccionesGuardadas);
  }
  return { direccionInicio: '', direccionFin: '' }; // Valores predeterminados si no hay direcciones
}

// Método para borrar las direcciones del localStorage
borrarDirecciones() {
  localStorage.removeItem(this.storageKey);
}
}
