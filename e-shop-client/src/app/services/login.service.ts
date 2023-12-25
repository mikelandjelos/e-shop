import { HttpClient } from '@angular/common/http';
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
}
