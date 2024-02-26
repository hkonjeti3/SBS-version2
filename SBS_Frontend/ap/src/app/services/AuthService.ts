//import { environment } from '../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
//import { Injectable } from '@angular/core';

//import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
    public username!: string;
    public password!: string;

  constructor(private http: HttpClient) {

  }

  login(username: string, password: string): Observable<any> {
    return this.http.get(environment.hostUrl + `/api/v1/login`,
      { headers: { authorization: this.createBasicAuthToken(username, password) } }).pipe(map((res) => {
        this.username = username;
        this.password = password;
        this.registerSuccessfulLogin(username, password);
      }));
  }

  createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(username + ":" + password);
  }

  registerSuccessfulLogin(_username: string, _password: string) {
    // save the username to session
  }
}