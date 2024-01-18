import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductFormComponent } from '../create-product-form/create-product-form.component';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,CreateProductFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username :any;
  user:any;
  isAdmin:boolean;
  constructor( private router: Router, private loginService:LoginService, public dialog: MatDialog)
  { 
    this.username = localStorage.getItem('username');
  localStorage.removeItem('username');
  const admin = localStorage.getItem('role')
  if(admin=='admin')
    this.isAdmin=true;
  else this.isAdmin = false;
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
  openDialog() {
    const dialogRef = this.dialog.open(CreateProductFormComponent, {
      width: '800px',
      height: '630px',
    });
  }
  logOut(route:string) {

    this.loginService.logout(this.username).subscribe((respo)=>{
      console.log(respo);
      this.router.navigate([`/${route}`]);
    })
    
  }
  openDialog2()
  {
    const dialogRef = this.dialog.open(WarehouseFormComponent, {
      width: '500px',
      height: '600px',
    });
  }
}
