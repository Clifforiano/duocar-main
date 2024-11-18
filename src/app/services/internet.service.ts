import { Injectable } from '@angular/core';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private isConnectedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private network: Network) {
    this.initializeNetworkEvents();
  }

  /**
   * Inicializa los eventos de conexión y desconexión.
   */
  private initializeNetworkEvents() {
    // Estado inicial
    this.isConnectedSubject.next(this.network.type !== 'none');

    // Escucha eventos de conexión
    this.network.onConnect().subscribe(() => {
      console.log('Conexión establecida');
      this.isConnectedSubject.next(true);
    });

    // Escucha eventos de desconexión
    this.network.onDisconnect().subscribe(() => {
      console.log('Conexión perdida');
      this.isConnectedSubject.next(false);
    });
  }

  /**
   * Devuelve un observable para detectar cambios en la conexión.
   */
  getNetworkStatus(): Observable<boolean> {
    return this.isConnectedSubject.asObservable();
  }

  /**
   * Devuelve el estado actual de la conexión.
   */
  isConnected(): boolean {
    return this.isConnectedSubject.value;
  }
}
