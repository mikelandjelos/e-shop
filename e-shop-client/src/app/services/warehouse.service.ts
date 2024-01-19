import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export type Warehouse = { id: string; name: string };

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  constructor(private httpClient: HttpClient) {}

  create(warehouseName: string, longitude: number, latitude: number) {
    return this.httpClient.post<{ id: string; name: string }>(
      environment.api + `warehouse/${longitude}/${latitude}`,
      {
        name: warehouseName,
      }
    );
  }

  getAllWarehouseIdsForUserInRadius(username: string, radius: number) {
    return this.httpClient.get<string[]>(
      environment.api + `warehouse/inRadius/${username}/${radius}`
    );
  }

  findAll(): Observable<Warehouse[]> {
    return this.httpClient.get<Warehouse[]>(
      environment.api + 'warehouse/findAll'
    );
  }
}
