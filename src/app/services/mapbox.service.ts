import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  private accessToken = 'pk.eyJ1IjoiY2xpZmZkdW9jIiwiYSI6ImNtM2J6a3ExeDA1dWMyanB3ZzZseWliczgifQ.9y1PTVPPEoLt6oWX9hEUAw';

  constructor() { }

  getAccessToken(): string {
    return this.accessToken;
  }
}