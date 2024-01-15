import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor( private router: Router, private loginService:LoginService){}
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  logOut(route:string) {

    this.loginService.logout("veljkovv").subscribe((respo)=>{
      console.log(respo);
      this.router.navigate([`/${route}`]);
    })
    
  }
}
