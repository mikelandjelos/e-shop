import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient:HttpClient) { }
  login (username:string,password:string):Observable<{access_token:string}>{
    const body = {username:username,password:password};
    return this.httpClient.post<{access_token:string}>(environment.api+"auth/login",body);
  }
  getUser(token:string){
    console.log(token)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const options = { headers: headers };
    return this.httpClient.get(environment.api+"auth/user",options);
  }
  signUp(firstName:string,lastName:string,username:string,phoneNumber:string,location:{name:string,longitude:number|undefined,lattitude:number|undefined}|undefined,password:string)
  {
    const body = {firstName:firstName,lastName:lastName,username:username,phoneNumber:phoneNumber,password:password};
    const bodyLocation = {username:username,location}
   console.log(bodyLocation)
     this.httpClient.post(environment.api+"customer/addLocation",bodyLocation).subscribe((respo)=>console.log(respo))
    return this.httpClient.post(environment.api+"customer/",body)
  }
  logout(username:string)
  {
    return this.httpClient.delete(`${environment.api}customer/Logout/${username}`)
  }
  getUserCredentials(username:string)
  {
    console.log(username);
    return this.httpClient.get(`${environment.api}customer/GetUserCredentiales/${username}`)
  }
  addLocationToGeoService(wareHouse:string,location:{name:string,longitude:number|undefined,lattitude:number|undefined}|undefined)
  {
    const bodyLocation = {username:wareHouse,location}
    this.httpClient.post(environment.api+"customer/addWareHouse",bodyLocation)
  }
}
