import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductFormComponent } from '../create-product-form/create-product-form.component';
import { WarehouseFormComponent } from '../warehouse-form/warehouse-form.component';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CreateProductFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: any;
  user: any;
  isAdmin: boolean;
  private socket!: Socket;
  constructor(
    private router: Router,
    private loginService: LoginService,
    public dialog: MatDialog
  ) {
    this.username = localStorage.getItem('username');
    localStorage.removeItem('username');
    const admin = localStorage.getItem('role');
    if (admin == 'admin') this.isAdmin = true;
    else this.isAdmin = false;
  }
  ngOnDestroy(): void {
    this.socket.close();
  }
  ngOnInit(): void {
    this.socket = io(environment.api); // Replace with your server URL

    this.socket.on('notification', (data) => {
      console.log(data);
    });
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
  logOut(route: string) {
    this.loginService.logout(this.username).subscribe((respo) => {
      console.log(respo);
      this.router.navigate([`/${route}`]);
    });
  }
  openDialog2() {
    const dialogRef = this.dialog.open(WarehouseFormComponent, {
      width: '500px',
      height: '600px',
    });
  }
}
