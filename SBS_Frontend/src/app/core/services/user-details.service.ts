import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private apiUrl = 'https://your-api-url.com'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<any[]> {
    const url = `${this.apiUrl}/user-details`; // Adjust the endpoint based on your API
    return this.http.get<any[]>(url);
  }
}
