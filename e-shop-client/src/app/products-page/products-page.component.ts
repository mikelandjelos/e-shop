import { Component, Inject, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Observable, from, of } from 'rxjs';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltersComponent } from '../filters/filters.component';
import { forkJoin } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  blob: any;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FiltersComponent],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  public categoryName: string = '';
  public blobImages: any = [];
  public changes: Observable<boolean> = of(false);
  public products$: Observable<{ products: any[]; total: number }> = from([]);
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.categoryName = this.route.snapshot.queryParamMap.get('category') ?? '';

    this.products$ = this.productService.getPaginatedFromCategory(
      1,
      10,
      this.categoryName
    );

    this.products$.subscribe((productsData) => {
      if (productsData.products && productsData.products.length > 0) {
        const observables = productsData.products.map((product) =>
          this.productService.getProductImage(product.image)
        );

        forkJoin(observables).subscribe((responses) => {
          responses.forEach((respo, index) => {
            console.log(respo);
            const objectURL = URL.createObjectURL(respo);
            console.log(productsData.products[index]);
            this.blobImages.push(
              this.domSanitizer.bypassSecurityTrustUrl(objectURL)
            );

            productsData.products[index].blob =
              this.domSanitizer.bypassSecurityTrustUrl(objectURL);
            console.log(productsData.products[index].blob);
            if (index === productsData.products.length - 1) {
              this.func();
            }
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
  func() {
    console.log('a');
    this.blobImages.forEach((el: any) => console.log(el));
    this.changes = of(true);
  }
  openPopup(product: any) {}
  logOut() {
    throw Error;
  }
  createImageFromBlob(image: Blob, fleg: number, product: any): any {
    const objectURL = URL.createObjectURL(image);

    product.blob = this.domSanitizer.bypassSecurityTrustUrl(
      objectURL
    ) as string;
  }
  handleFiltersSelected(event: { search: string; range: number }) {
    console.log('Filters selected:', event);
  }
}
