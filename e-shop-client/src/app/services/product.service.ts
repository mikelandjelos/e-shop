import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient:HttpClient) { }
  createProduct(title: string, price: number, description: string, stock: number, category: string, wareHouse: string, image: File) {
    const formData: FormData = new FormData();
    
    formData.append('name', title);
    formData.append('price', price.toString());
    formData.append('description', description);
    formData.append('stock', stock.toString());
    formData.append('category', category);
    formData.append('wareHouse', wareHouse);
    formData.append('file', image);
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
     this.httpClient.post(environment.api + 'product', formData).subscribe((resp)=>console.log(resp))
  }
  getProductImage(imageName: string): Observable<Blob> {
    const requestOptions: Object = { responseType: 'blob' };
    return (this.httpClient.get<Blob>(`${environment.api}product/product-image/${imageName}`,requestOptions));
  }
}
