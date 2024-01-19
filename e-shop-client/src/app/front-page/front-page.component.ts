import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { CreateProductFormComponent } from '../create-product-form/create-product-form.component';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { LoginService } from '../services/login.service';
import { Category, CategoryService } from '../services/category.service';
import { Observable, from } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderComponent],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css',
})
export class FrontPageComponent implements OnInit {
  changeSales = false;
  changeOutOfStock = false;
  changeArrivals = false;
  topSales: any = [];
  topSalesImages: any = [];
  newArrivals: any = [];
  newArrivalsImages: any = [];
  outOfStock: any = [];
  outOfStockImages: any = [];
  user: any;
  username: any;

  categories$: Observable<Category[]> = from([]);

  private socket!: Socket;
  notifications: any[] = [];

  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private categoryService: CategoryService
  ) {
    productService.getTopSales().subscribe((respo) => {
      const mergedArrivals = [].concat(...respo);
      console.log(respo);
      this.topSales = mergedArrivals;
      if (
        this.topSales != null &&
        this.topSales != undefined &&
        this.topSales.length > 0
      )
        this.processImages();
    });
    productService.getOutOfStock().subscribe((respo) => {
      const mergedArrivals = [].concat(...respo);
      this.outOfStock = mergedArrivals;
      if (
        this.outOfStock != null &&
        this.outOfStock != undefined &&
        this.outOfStock.length > 0
      )
        this.processImagesOfStock();
    });
    productService.getNewArrivals().subscribe((respo) => {
      const mergedArrivals = [].concat(...respo);
      this.newArrivals = mergedArrivals;
      if (
        this.newArrivals != null &&
        this.newArrivals != undefined &&
        this.newArrivals.length > 0
      )
        this.processImagesArrivals();
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.findAll();
  }

  createImageFromBlob(image: Blob, fleg: number): any {
    const objectURL = URL.createObjectURL(image);

    if (objectURL == undefined) console.log('a');
    if (fleg == 0)
      this.topSalesImages.push(
        this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string
      );
    else if (fleg == 1)
      this.newArrivalsImages.push(
        this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string
      );
    else if (fleg == 2)
      this.outOfStockImages.push(
        this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string
      );
  }

  openPopup(product: any): void {
    this.dialog.open(ProductDetailComponent, {
      width: '800px',
      height: '630px',
      data: { product: product },
    });
  }

  onChange(fleg: string) {
    if (fleg == 'sale') this.changeSales = true;
  }

  open() {
    this.dialog.open(ProductDetailComponent, {
      width: '800px',
      height: '630px',
    });
  }

  processImages() {
    this.topSales.forEach((product: any, index: any) => {
      if (product.image != null)
        this.productService
          .getProductImage(product.image)
          .subscribe((respo) => {
            this.createImageFromBlob(respo, 0);

            product.blob = this.topSalesImages[index];
            console.log(product.blob);
            if (product.blob == undefined) {
              this.createImageFromBlob(respo, 0);

              product.blob = this.topSalesImages[index];
            }
          });
    });
    this.changeSales = true;
  }

  processImagesOfStock() {
    this.outOfStock.forEach((product: any, index: any) => {
      if (product.image != null)
        this.productService
          .getProductImage(product.image)
          .subscribe((respo) => {
            this.createImageFromBlob(respo, 2);

            product.blob = this.outOfStockImages[index];
            console.log(product.blob);
            if (product.blob == undefined) {
              this.createImageFromBlob(respo, 2);
              product.blob = this.outOfStockImages[index];
            }
          });
    });
    this.changeOutOfStock = true;
  }

  processImagesArrivals() {
    this.newArrivals.forEach((product: any, index: any) => {
      if (product.image != null)
        this.productService
          .getProductImage(product.image)
          .subscribe((respo) => {
            this.createImageFromBlob(respo, 1);
            product.blob = this.newArrivalsImages[index];

            if (product.blob == undefined) {
              this.createImageFromBlob(respo, 1);
              product.blob = this.newArrivalsImages[index];
            }
          });
    });
    this.changeArrivals = true;
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  navigateToProducts(route: string, category: string): void {
    this.router.navigate([`/${route}`], {
      queryParams: { category: category },
    });
  }

  logOut() {
    throw Error;
  }
}
