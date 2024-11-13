import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {

  private readonly accessToken = 'pk.eyJ1IjoiY2xpZmZkdW9jIiwiYSI6ImNtM2J6dms2aDFteXcycXB0azk4b2FqN2oifQ.mVjNKoYMZpBl26cOVMJUwQ'; // Reemplaza con tu clave API
  private readonly geocodeUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

  constructor(private http: HttpClient) {}

  search(query: string): Observable<any> {
    const url = `${this.geocodeUrl}${encodeURIComponent(query)}.json?access_token=${this.accessToken}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error en la solicitud de geocodificación', error);
        return throwError(error); // Re-throw the error
      })
    );
  }

  reverseGeocode(lat: number, lon: number): Observable<any> {
    const url = `${this.geocodeUrl}${lon},${lat}.json?access_token=${this.accessToken}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error en la solicitud de geocodificación inversa', error);
        return throwError(error); // Re-throw the error
      })
    );
  }



  
}
