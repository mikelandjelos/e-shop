import { FrontPageComponent } from './front-page/front-page.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GeoComponent } from './geo/geo.component';
import { CreateProductFormComponent } from './create-product-form/create-product-form.component';
import { FiltersComponent } from './filters/filters.component';

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'geo', pathMatch: 'full', component: GeoComponent },
  { path: 'front-page', pathMatch: 'full', component: FrontPageComponent },
  { path: '', redirectTo: '/front-page', pathMatch: 'full' },
  { path: 'c', pathMatch: 'full', component: FiltersComponent },
];
