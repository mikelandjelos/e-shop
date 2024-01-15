import { FrontPageComponent } from './front-page/front-page.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GeoComponent } from './geo/geo.component';
import { CreateProductFormComponent } from './create-product-form/create-product-form.component';
import { FiltersComponent } from './filters/filters.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { HeaderComponent } from './header/header.component';


export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'geo', pathMatch: 'full', component: GeoComponent },
  { path: 'front-page', pathMatch: 'full', component: FrontPageComponent },
  { path: 'cart', pathMatch: 'full', component: ShoppingCartComponent },
  { path: 'd', pathMatch: 'full', component: ProductDetailComponent },
  { path: 'k', pathMatch: 'full', component: HeaderComponent },
  { path: '', redirectTo: '/front-page', pathMatch: 'full' },
];
