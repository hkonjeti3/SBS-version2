import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { user } from './user'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/v1/';
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<user[]> {
    const url = this.baseUrl + 'admin/users'; // Use a constructed URL from baseUrl
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //   }),
    //   responseType: 'text' as 'json' // Specify the response type as text
    // };

    return this.http.get<user[]>(`${this.baseUrl}admin/users`)
      .pipe(
        tap((users: user[]) => console.log('Fetched users:', users)), // Log the users for verification
        catchError((error: any) => {
          console.error('Error from backend:', error);
          return throwError(error);
        })
      );
  }

  // Add other service methods as needed
}
