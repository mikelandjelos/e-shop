import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IonicModule } from '@ionic/angular';
import { CreateProductFormComponent } from '../create-product-form/create-product-form.component';

@Component({
  selector: 'app-front-page',
  standalone: true,
  imports: [IonicModule],
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.css'
})
export class FrontPageComponent {
  constructor(public dialog:MatDialog){}
  openDialog(){
    console.log('a');
    const dialogRef = this.dialog.open(CreateProductFormComponent,{width:'800px',height:'630px'})
  }
}
