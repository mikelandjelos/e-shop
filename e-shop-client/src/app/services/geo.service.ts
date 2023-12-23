import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GeoService {
  private apiKey = '3a195e45cecb40c2b7d73ec7d014c902';
  private apiKey2 = '47f84134d345440c8d9d5294fa7256d3';
  constructor(private http: HttpClient) {}

  getCoordinates(city: string): Observable<any> {
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${this.apiKey}`;
    return this.http.get(apiUrl);
  }
  searchCities(query:string):Observable<any>{
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${this.apiKey2}&limit=5`;
    return this.http.get(apiUrl);
  }

}
