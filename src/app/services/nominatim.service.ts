import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominatimService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search';
  private httpClient!: HttpClient; // Lazy injection

  constructor(private injector: Injector) {}

  private getHttpClient(): HttpClient {
    if (!this.httpClient) {
      this.httpClient = this.injector.get(HttpClient);
    }
    return this.httpClient;
  }

  // Método para buscar direcciones usando Nominatim
  search(query: string): Observable<any> {
    const params = {
      q: query,
      format: 'json',
      addressdetails: '1',
      limit: '5',
    };
    return this.getHttpClient().get<any>(this.apiUrl, { params });
  }
}