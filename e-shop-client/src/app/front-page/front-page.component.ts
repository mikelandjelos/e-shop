import { Component } from '@angular/core';
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

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [CommonModule, IonicModule,HeaderComponent],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css',
})
export class FrontPageComponent {
  changeSales = false;
  changeOutOfStock = false;
  changeArrivals = false;
  topSales: any = [];
  topSalesImages: any = [];
  newArrivals: any = [];
  newArrivalsImages: any = [];
  outOfStock:any = [];
  outOfStockImages:any =[];
  user:any;
  username:any;
  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    
  ) {
    productService.getTopSales().subscribe((respo) => {
      const mergedArrivals = [].concat(...respo);
      this.topSales = mergedArrivals;
      if(this.topSales!=null && this.topSales!=undefined && this.topSales.length>0)
      this.processImages();
     
    });
    productService.getOutOfStock().subscribe((respo) => {
      const mergedArrivals = [].concat(...respo);
      this.outOfStock = mergedArrivals;
      if(this.outOfStock!=null && this.outOfStock!=undefined && this.outOfStock.length>0)
      this.processImagesOfStock();
      
    });
    productService.getNewArrivals().subscribe((respo) => {
      const mergedArrivals = [].concat(...respo);
      this.newArrivals = mergedArrivals;
      if(this.newArrivals!=null && this.newArrivals!=undefined && this.newArrivals.length>0)
      this.processImagesArrivals();
      
    });
   
  }
  createImageFromBlob(image: Blob, fleg: number): any {
    const objectURL = URL.createObjectURL(image);
    
    if(objectURL==undefined)
    console.log('a')
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
      if(product.image!=null)
      this.productService.getProductImage(product.image).subscribe((respo) => {
        this.createImageFromBlob(respo, 0);

        product.blob = this.topSalesImages[index];
        if(product.blob == undefined)
        {
          this.createImageFromBlob(respo, 0);

          product.blob = this.topSalesImages[index];
        }
      });
    });
    this.changeSales = true;
  }
  processImagesOfStock() {
    
    this.outOfStock.forEach((product: any, index: any) => {
      if(product.image!=null)
      this.productService.getProductImage(product.image).subscribe((respo) => {
        this.createImageFromBlob(respo, 2);

        product.blob = this.outOfStockImages[index];
        if(product.blob==undefined)
        {
          this.createImageFromBlob(respo, 2);
        product.blob = this.outOfStockImages[index];
        }
      });
    });
    this.changeOutOfStock = true;
  }
  processImagesArrivals() {
    this.newArrivals.forEach((product: any, index: any) => {
      if(product.image!=null)
      this.productService.getProductImage(product.image).subscribe((respo) => {
        this.createImageFromBlob(respo, 1);
        product.blob = this.newArrivalsImages[index];
        
        if(product.blob==undefined)
        {
          this.createImageFromBlob(respo, 1);
        product.blob = this.newArrivalsImages[index];
        }
      });
    });
    this.changeArrivals = true;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logOut() {
    throw Error;
  }
}
