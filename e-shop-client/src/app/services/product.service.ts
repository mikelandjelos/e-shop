import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../products-page/products-page.component';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}
  createProduct(
    title: string,
    price: number,
    description: string,
    stock: number,
    category: any,
    wareHouse: any,
    image: File
  ) {
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
    this.httpClient
      .post(environment.api + 'product', formData)
      .subscribe((resp) => console.log(resp));
  }
  getProductImage(imageName: string): Observable<Blob> {
    const requestOptions: Object = { responseType: 'blob' };
    return this.httpClient.get<Blob>(
      `${environment.api}product/product-image/${imageName}`,
      requestOptions
    );
  }
  getTopSales(): Observable<any> {
    return this.httpClient.get(environment.api + 'product/TopSales');
  }
  getNewArrivals(): Observable<any> {
    return this.httpClient.get(environment.api + 'product/LastFour');
  }
  getOutOfStock(): Observable<any> {
    return this.httpClient.get(environment.api + 'product/OutOfStock');
  }
  getLastMeasuredValue(id: string) {
    return this.httpClient.get(`${environment.api}product/lastView/${id}`);
  }
  incrementViews(id: string) {
    return this.httpClient.put(
      `${environment.api}product/incrementViews/${id}`,
      {}
    );
  }
  setToCart(product: any) {
    return this.httpClient.post(`${environment.api}product/setInCache`, {
      product,
    });
  }
  getAllFromCart(): Observable<any> {
    return this.httpClient.get(`${environment.api}product/GetProductsFromCart`);
  }
  checkout(id: string, count: number) {
    return this.httpClient.put(
      `${environment.api}product/decreaseStock/${id}/${count}`,
      {}
    );
  }
  deleteAllFromCart() {
    return this.httpClient.delete(`${environment.api}product/DeleteFromCache`);
  }

  getPaginatedFromCategory(
    page: number = 1,
    pageSize: number = 10,
    categoryName: string = ''
  ): Observable<{ products: Product[]; total: number }> {
    return this.httpClient.get<{ products: Product[]; total: number }>(
      environment.api +
        `product/paginated?page=${page}&pageSize=${pageSize}` +
        (categoryName ? `&category=${categoryName}` : '')
    );
  }

  follow(product: any): Observable<string> {
    const id = product.id;
    console.log(id);
    return this.httpClient.get(`${environment.api}product/subscribe/${id}`, {
      responseType: 'text',
    });
  }
}
