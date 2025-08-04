import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, loginData);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createOrUpdateUser`, userData);
  }

  validateOtp(otpData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/validate-otp`, otpData);
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp`, { email });
  }

  updatePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-password`, passwordData);
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/profile`);
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/profile`, profileData);
  }

  getUserData(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/userProfile?id=${userId}`);
  }

  updateUserData(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/user/update`, userData);
  }
}

  