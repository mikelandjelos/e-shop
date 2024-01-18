import { FrontPageComponent } from './front-page/front-page.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GeoComponent } from './geo/geo.component';
import { FiltersComponent } from './filters/filters.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { HeaderComponent } from './header/header.component';
import { ProductsPageComponent } from './products-page/products-page.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'e', pathMatch: 'full', component: WarehouseFormComponent },
  { path: 'geo', pathMatch: 'full', component: GeoComponent },
  { path: 'front-page', pathMatch: 'full', component: FrontPageComponent },
  {
    path: 'products-page',
    pathMatch: 'full',
    component: ProductsPageComponent,
  },
  { path: 'cart', pathMatch: 'full', component: ShoppingCartComponent },

  { path: 'd', pathMatch: 'full', component: ProductDetailComponent },
  { path: 'k', pathMatch: 'full', component: HeaderComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
