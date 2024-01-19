import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
   products:any ; total :number=0;
   outOfStockImages: any = [];
   constructor(private productService: ProductService, private sanitizer: DomSanitizer, private router:Router, private dialog:MatDialog) {
    this.productService.getAllFromCart().subscribe((respo) => {
      console.log(respo)
      this.products = respo.map((product:any) => ({
        ...product,
        safeBlobUrl: this.sanitizer.bypassSecurityTrustUrl(product.blob),
        quantity:1
      }));
      this.products.forEach((prod:any)=>{this.total+=parseInt(prod.price)})
      console.log(this.products);
    });
  }
  getQuantityOptions(stock: number): number[] {
    
    return Array.from({ length: stock }, (_, index) => index + 1);
  }
  updateQuantity(event: Event,product:any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    const num =parseInt(selectedValue);
       product.price *= num;
      this.total +=product.price;
      product.quantity = num;
  }
  navigateTo(route:string){
    this.router.navigate([`/${route}`]);
  }
  checkout()
  {
    this.productService.deleteAllFromCart().subscribe((respo)=>console.log(respo));
    this.products.forEach((el:any)=>{
        this.productService.checkout(el.id,el.quantity).subscribe((respo)=>{console.log(respo)
        
          this.dialog.open(NotificationPopupComponent, {
            data: {
              title: 'Your order are confirmed',
              text: '',
            },})
        })
    })
  }
  outFromCart(product:any)
  {
    console.log(product);
    this.products=this.products.filter((el:any)=>el!=product);
    console.log(this.products);
  }
}
