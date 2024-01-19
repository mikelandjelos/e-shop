import { ProductsPageComponent } from './products-page/products-page.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GeoComponent } from './geo/geo.component';
import { LoginComponent } from './login/login.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { CreateProductFormComponent } from './create-product-form/create-product-form.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GeoComponent,
    LoginComponent,
    FrontPageComponent,
    CreateProductFormComponent,
    ProductsPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'e-shop-client';
}
