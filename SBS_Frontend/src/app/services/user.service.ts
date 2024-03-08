import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getUserData(): Observable<any> {
    return this.userData;
  }

  updateUserData(updatedData: any): Observable<any>  {
    return this.userData = { ...this.userData, ...updatedData };
  }
}

  