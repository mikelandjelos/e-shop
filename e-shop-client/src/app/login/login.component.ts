import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeoService } from '../services/geo.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm:FormGroup;
  constructor(private loginService:LoginService,private formBuilder:FormBuilder,private geoService:GeoService,private dialog:MatDialog,private router:Router){
    this.loginForm=this.formBuilder.group({firstName:'',lastName:'',username:'',phoneNumber:'',location:'',password:''});
  }
  suggestions: string[] = [];
  isGx = false;
  isTxr = false;
  isHiddenC1 = false;
  isHiddenC2 = true;
  isTxl = false;
  isZ200 = false;
  selectSuggestion(suggestion:string):void{
    console.log(suggestion)
    this.loginForm.get('location')?.setValue(suggestion);
   
    this.suggestions = [];
  }
  onChange():void{
    const location = this.loginForm.value.location;
    if(location.length>1)
    this.geoService.searchCities(location).subscribe(
      (data: any) => {
        data.results.forEach((element: any) => {
          console.log(element.formatted);
          this.suggestions = data.results.map((element: any) => element.formatted);
        });
      },
      
      (error) => {
        console.error('Greška prilikom HTTP poziva:', error);
        this.suggestions = [];
      }
      
    );
    else
        this.suggestions=[];
     
      

  }
  changeForm(): void {
    this.isGx = true;
    

    this.isTxr = !this.isTxr;
    this.isHiddenC1 = !this.isHiddenC1;
    this.isHiddenC2 = !this.isHiddenC2;
    this.isTxl = !this.isTxl;
    this.isZ200 = !this.isZ200;
  }
 async onSubmit(arg:string){
  
  const password = this.loginForm.value.password;
  const username = this.loginForm.value.username;
  if(password.length<3 || username.length<3)
    this.dialog.open(NotificationPopupComponent,{ data: { title: "Please enter valid credentials", text:"Fields should have at least 3 characters each."  }})
    else if (arg == 'login') {
      this.loginService.login(username, password).subscribe((respo:any) => {
        console.log(respo);
    
        if (respo.status !=400) {
          
          this.loginService.getUser(respo.access_token).subscribe((res) => {
            console.log(res);
            this.router.navigate([`/front-page`])
          });
        } else {
          console.log('a')
          this.dialog.open(NotificationPopupComponent,{ data: { title: "Please enter valid credentials", text:"Username or password are incorrect"  }})
        }
      });
    }
  else
  {
    const locationName:string = this.loginForm.value.location;
    const firstName = this.loginForm.value.firstName;
    const lastName = this.loginForm.value.lastName;
    const phoneNumber = this.loginForm.value.phoneNumber;
    const isPhoneNumberValid: boolean = /^\d+$/.test(phoneNumber);
    if(!isPhoneNumberValid || locationName.length<3 || firstName.length<3 || lastName.length<3 ||phoneNumber.length<3)
    this.dialog.open(NotificationPopupComponent,{ data: { title: "Please enter valid credentials", text:"Fields should have at least 3 characters each."  }})
    else{
    let location={name:locationName,lattitude:0,longitude:0};
    await this.getCoordinates(locationName).toPromise().then((res) => {
      location.lattitude = res?.lattitude ?? 0;
      location.longitude = res?.longitude ?? 0; 
    });
    this.loginService.signUp(firstName,lastName,username,phoneNumber,location,password).subscribe((respo)=>{console.log(respo)
      this.dialog.open(NotificationPopupComponent,{ data: { title: "Please login now", text:"Enter your username and password"  }})
    });
  }
  }
 
  
}
 getCoordinates(location:string):Observable<{ name: string, longitude: number, lattitude: number }>
 {
  return new Observable(observer => {
  this.geoService.getCoordinates(location).subscribe(
    (data: any) => {
      console.log('Odgovor od API-ja:', data);

      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry;
        const center = {
          lat: location.lat,
          lng: location.lng,
        };
        console.log('Koordinate grada:', center);
        const result ={name:location,longitude:center.lng,lattitude:center.lat};
        observer.next(result);
      } else {
        console.error('Nije moguće dobiti koordinate za uneseni grad.');
      }
    },
    (error) => {
      console.error('Greška prilikom HTTP poziva:', error);
      
    },
    () => {
      
      observer.complete();
    }
  );
});
}
}
