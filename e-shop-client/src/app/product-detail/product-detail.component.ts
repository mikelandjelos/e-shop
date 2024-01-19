import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  numberOfViews = null;
  lastView: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService
  ) {
    this.lastView = new Date();
    console.log('Product details:', data.product);
    productService
      .getLastMeasuredValue(data.product.id)
      .subscribe((respo: any) => {
        if (respo != null) {
          console.log(respo);
          this.lastView = respo[1];
          this.numberOfViews = respo[0];
        } else {
          const originalDate = new Date(this.lastView);

          const formattedDate = `${originalDate.toLocaleDateString()}, ${originalDate.toLocaleTimeString()}`;
          this.lastView = formattedDate;
        }
        productService
          .incrementViews(data.product.id)
          .subscribe((respo) => console.log(respo));
      });
  }
  addToCart(product: any) {
    this.productService
      .setToCart(product)
      .subscribe((respo) => console.log(respo));
  }
  follow(product: any) {
    this.productService.follow(product).subscribe(console.log);
  }
}
