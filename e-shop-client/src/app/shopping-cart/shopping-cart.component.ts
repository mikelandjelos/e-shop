import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
   products:any ; total :number=0;
   constructor(private productService: ProductService, private sanitizer: DomSanitizer) {
    this.productService.getAllFromCart().subscribe((respo) => {
      this.products = respo.map((product:any) => ({
        ...product,
        safeBlobUrl: this.sanitizer.bypassSecurityTrustUrl(product.blob),
        quantity:1
      }));
      this.products.forEach((prod:any)=>{this.total+=parseInt(prod.price)})
      console.log(this.products);
    });
  }
  updateQuantity(event: Event,product:any) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    
    const num =parseInt(selectedValue);
       product.price *= num;
      this.total +=product.price;
   
  }
}
