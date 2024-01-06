import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-create-product-form',
  standalone: true,
  imports: [IonicModule,CommonModule,ReactiveFormsModule],
  templateUrl: './create-product-form.component.html',
  styleUrl: './create-product-form.component.css'
})
export class CreateProductFormComponent {
  createForm:FormGroup;
constructor(private dialogRef: MatDialogRef<CreateProductFormComponent>,private formBuilder:FormBuilder,private productService:ProductService){
  this.createForm=this.formBuilder.group({title:'',price:'',description:'',stock:'',category:'',wareHouse:''});
}
close(){
  this.dialogRef.close()
}
onSubmit()
{
  const title = this.createForm.value.title;
  const price = Number(this.createForm.value.price);
  const description = this.createForm.value.description;
  const stock = Number(this.createForm.value.stock);
  const category = this.createForm.value.category;
  const wareHouse = this.createForm.value.wareHouse;
  this.productService.createProduct(title,price,description,stock,category,wareHouse);
}
}
