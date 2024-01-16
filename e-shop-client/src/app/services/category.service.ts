import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type Category = { id: string; name: string; description: string };

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  findAll(): Observable<Array<Category>> {
    const categories$ = this.httpClient.get<Array<Category>>(
      `${environment.api}category`
    );

    categories$.subscribe(console.log);

    return categories$;
  }
}
