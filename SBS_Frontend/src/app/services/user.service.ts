import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData: any = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    address: '123 Main Street, City, Country',
  };

  private baseUrl = 'http://localhost:8080/api/v1';
  
  constructor(private http: HttpClient) {}

  getUserData(userId: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/userProfile?id=${userId}`, { headers: headers });
  }

  updateUserData(updatedData: any) {
    const url = this.baseUrl + '/transaction/updateUserProfile';
    // const body = {updatedData};
    // console.log(body);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(url, updatedData, httpOptions );
  }
}

  