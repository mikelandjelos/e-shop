import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { io } from 'socket.io-client';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  numberOfViews = null;  username: string;

  lastView: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService: ProductService,private dialog:MatDialog
  ) {
    this.username = localStorage.getItem('username') ?? '';

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
      .subscribe((respo) => { this.dialog.open(NotificationPopupComponent, {
        data: {
          title: 'Notification',
          text: 'The product has been added to the cart',
        },
      });});
  }
  follow(product: any) {
    this.productService.follow(product,this.username).subscribe((respo)=>{
      this.dialog.open(NotificationPopupComponent, {
        data: {
          title: 'Notification',
          text: 'Product was followed',
        },
      });
    });
  }
}
