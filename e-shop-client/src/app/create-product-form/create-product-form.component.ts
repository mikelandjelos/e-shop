import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Category, CategoryService } from '../services/category.service';
import { Observable, from } from 'rxjs';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  selector: 'app-create-product-form',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule,NotificationPopupComponent],
  templateUrl: './create-product-form.component.html',
  styleUrl: './create-product-form.component.css',
})
export class CreateProductFormComponent implements OnInit {
  createForm: FormGroup;
  categories$: Observable<Category[]> = from([]);

  constructor(
    private dialogRef: MatDialogRef<CreateProductFormComponent>,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService, private dialog:MatDialog
  ) {
    this.createForm = this.formBuilder.group({
      title: '',
      price: '',
      description: '',
      stock: '',
      category: '',
      wareHouse: '',
      image: null,
    });
  }
  ngOnInit(): void {
    this.categories$ = this.categoryService.findAll();
  }
  close() {
    this.dialogRef.close();
    console.log('a')
    window.location.reload()
  }
  onSubmit() {
    const title = this.createForm.value.title;
    const price = Number(this.createForm.value.price);
    const description = this.createForm.value.description;
    const stock = Number(this.createForm.value.stock);
    const category = this.createForm.value.category;
    const wareHouse = this.createForm.value.wareHouse;
    const image: File = this.createForm.value.image;
    if(image)
    this.productService.createProduct(
      title,
      price,
      description,
      stock,
      category,
      wareHouse,
      image
    ).subscribe((respo)=>{
      this.dialog.open(NotificationPopupComponent, {
        data: {
          title: 'Notification',
          text: "Product was created",
        }
      });
    });
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.createForm.patchValue({ image: file });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.createForm.patchValue({
        image: file,
      });
    }
  }
}
