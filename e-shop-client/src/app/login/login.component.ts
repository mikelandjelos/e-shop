import { CommonModule } from '@angular/common';
import {Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm:FormGroup;
  constructor(private loginService:LoginService,private formBuilder:FormBuilder){
    this.loginForm=this.formBuilder.group({firstName:'',lastName:'',username:'',phoneNumber:'',location:'',password:''});
  }
  
  isGx = false;
  isTxr = false;
  isHiddenC1 = false;
  isHiddenC2 = true;
  isTxl = false;
  isZ200 = false;
  password :string = '';
 

  changeForm(): void {
    this.isGx = true;
    

    this.isTxr = !this.isTxr;
    this.isHiddenC1 = !this.isHiddenC1;
    this.isHiddenC2 = !this.isHiddenC2;
    this.isTxl = !this.isTxl;
    this.isZ200 = !this.isZ200;
  }
 onSubmit(){
  const password = this.loginForm.value.password;
  const username = this.loginForm.value.username;
  this.loginService.login(username,password).subscribe()
 }
}
