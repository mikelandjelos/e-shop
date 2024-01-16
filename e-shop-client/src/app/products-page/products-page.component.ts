import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent {
  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
