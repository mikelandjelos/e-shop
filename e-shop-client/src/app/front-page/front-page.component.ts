import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { CreateProductFormComponent } from '../create-product-form/create-product-form.component';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [CommonModule,IonicModule],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})
export class FrontPageComponent {
  image:any;
  changedImage = false;
  //https://i.postimg.cc/t403yfn9/home2.jpg
 
  constructor(public dialog:MatDialog,productService:ProductService,private domSanitizer:DomSanitizer){
  
    
    const img = 'PetraDjordjevic6f59ba37-5401-4564-8aaf-c94dc5c6d723.jpg';
    productService.getProductImage(img).subscribe((respo)=>{
       this.createImageFromBlob(respo);
    })
    console.log(this.image);
  }
  createImageFromBlob(image: Blob): any {
   console.log(image);
    const objectURL = URL.createObjectURL(image);
    this.image=this.domSanitizer.bypassSecurityTrustUrl(objectURL) as string;
    
    this.onImageChange();
  }
  onImageChange() {
    
    this.changedImage = true;
  }
  openDialog(){
    console.log('a');
    const dialogRef = this.dialog.open(CreateProductFormComponent,{width:'800px',height:'630px'})
  }
}
