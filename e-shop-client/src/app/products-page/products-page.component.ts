import { Component, Inject, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { Observable, from } from 'rxjs';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  public categoryName: string = '';
  public products$: Observable<{ products: Product[]; total: number }> = from(
    []
  );
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.queryParamMap.get('category') ?? '';

    this.products$ = this.productService.getPaginatedFromCategory(
      1,
      3,
      this.categoryName
    );
  }
}
