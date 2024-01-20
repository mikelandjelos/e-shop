import { Component, Inject, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Observable, from, map, of, range, switchMap, tap } from 'rxjs';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FiltersComponent } from '../filters/filters.component';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { WarehouseService } from '../services/warehouse.service';
import { appConfig } from '../app.config';

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
  imports: [
    HeaderComponent,
    CommonModule,
    FiltersComponent,
    ProductDetailComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  public categoryName: string = '';
  public blobImages: any = [];
  public changes: Observable<boolean> = of(false);
  public products$: Observable<{ products: any[]; total: number }> = from([]);
  public username: string = '';
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private router: Router,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.username = localStorage.getItem('username') ?? '';
  }
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
  openPopup(product: any, i: number): void {
    const blob = this.blobImages[i];
    this.dialog.open(ProductDetailComponent, {
      width: '800px',
      height: '630px',
      data: { product: product, blob: blob },
    });
  }
  logOut() {
    throw Error;
  }
  createImageFromBlob(image: Blob, fleg: number, product: any): any {
    const objectURL = URL.createObjectURL(image);

    product.blob = this.domSanitizer.bypassSecurityTrustUrl(
      objectURL
    ) as string;
  }
  handleFiltersSelected(event: { searchPattern: string; radius: number }) {
    this.products$ = this.warehouseService
      .getAllWarehouseIdsForUserInRadius(this.username, event.radius)
      .pipe(
        switchMap((warehouseIds) => {
          console.log(warehouseIds);
          return this.productService.findAllProductsForWarehouseIds(
            event.searchPattern,
            this.categoryName,
            warehouseIds
          );
        })
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
}
