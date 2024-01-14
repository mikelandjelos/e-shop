import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { CreateProductFormComponent } from '../create-product-form/create-product-form.component';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [CommonModule,IonicModule],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})
export class FrontPageComponent {

  
  changeSales = false;
 
  changeArrivals = false;
  topSales:any =[];
  topSalesImages:any=[];
  newArrivals : any = [];
  newArrivalsImages:any=[];
  constructor(public dialog:MatDialog,private productService:ProductService,private domSanitizer:DomSanitizer){
  
    
    productService.getTopSales().subscribe((respo)=>{
      const mergedArrivals = [].concat(...respo);
      this.topSales=mergedArrivals;
      
      
      this.processImages();
     this.changeSales=true;
    })
    
    productService.getNewArrivals().subscribe((respo)=>{
      const mergedArrivals = [].concat(...respo);this.newArrivals = mergedArrivals; 
     
      this.processImagesArrivals();
      this.changeArrivals=true;
    })
   
   
  }
  createImageFromBlob(image: Blob,fleg:number): any {
  
    const objectURL = URL.createObjectURL(image);
    if(fleg == 0)
   this.topSalesImages.push( this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string);
   else if(fleg == 1 )
   this.newArrivalsImages.push( this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string);
    
  }
  openPopup(product: any): void {
    this.dialog.open(ProductDetailComponent, {
      width: '800px',
      height: '630px',
      data: { product: product }
    });
  }
  onChange(fleg:string) {
   
   
    if(fleg =='sale')
    this.changeSales=true
  }
  openDialog(){
    
    const dialogRef = this.dialog.open(CreateProductFormComponent,{width:'800px',height:'630px'})
  }
  open(){
    this.dialog.open(ProductDetailComponent,{width:'800px',height:'630px'})
  }
  processImages()
  {
    this.topSales.forEach((product: any,index:any) => {
      this.productService.getProductImage(product.image).subscribe((respo)=>{
        
        this.createImageFromBlob(respo,0)
       
        product.blob = this.topSalesImages[index]
        
      })
    });
  }

  processImagesArrivals()
  {
    
    this.newArrivals.forEach((product: any,index:any) => {
     
      this.productService.getProductImage(product.image).subscribe((respo)=>{
        
        this.createImageFromBlob(respo,1)
        product.blob = this.newArrivalsImages[index];
        console.log(product.blob)
        
        
      })
    });
  }
  
}
