import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }
  createProduct(title:string,price:number,description:string,stock:number,category:string,wareHouse:string)
  {
    const body = {
      name:title,
      price:price,
      description:description,
      stock:stock,
      category:category,
      wareHouse:wareHouse
    }
    this.httpClient.post(environment.api+"product",body).subscribe((mess)=>console.log(mess));
  }
}
