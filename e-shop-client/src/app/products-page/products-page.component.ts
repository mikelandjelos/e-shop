import { Component, Inject, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Observable, from, of } from 'rxjs';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  blob:any;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  public categoryName: string = '';
  public changes:Observable<boolean> = of(false);
  public products$: Observable<{ products: any[]; total: number }> = from(
    []
  );
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService, private router: Router, private domSanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.categoryName = this.route.snapshot.queryParamMap.get('category') ?? '';
  
    this.products$ = this.productService.getPaginatedFromCategory(1, 3, this.categoryName);
  
    this.products$.subscribe(productsData => {
      if (productsData.products && productsData.products.length > 0) {
        productsData.products.forEach(product => {
          this.productService.getProductImage(product.image).subscribe((respo) => {
            console.log(respo)
            const objectURL = URL.createObjectURL(respo);
            console.log(product)
            product.blob = this.domSanitizer.bypassSecurityTrustUrl(objectURL);
            console.log(product.blob)
           
            this.changes=of(true);
            
           
           
          });
        });
       
      }

     
    });
  }
  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  navigateToProducts(route: string, category: string): void {
    this.router.navigate([`/${route}`], {
      queryParams: { category: category },
    });
  }
  openPopup(product:any){}
  logOut() {
    throw Error;
  }
  createImageFromBlob(image: Blob, fleg: number, product:any): any {
    const objectURL = URL.createObjectURL(image);

   
   
    
      product.blob= this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string
      
     
  }

}
