import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { account } from './account'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:8080/api/v1/account'; // Base URL to your API

  constructor(private http: HttpClient) {}

  getAllAccounts(userId: number): Observable<account[]> {
    // userId = 4;
    const url = `${this.baseUrl}/user/${userId}/accountDetails`; // Dynamic URL including the userId

    return this.http.get<account[]>(url)
      .pipe(
        tap((accounts: account[]) => console.log('Fetched Accounts:', accounts)),
        catchError((error: any) => {
            console.error('Error from backend:', error);
            return throwError(error);
          })
      );
  }

  // Add other service methods as needed
  
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}
