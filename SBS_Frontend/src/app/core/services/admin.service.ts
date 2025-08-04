import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { user } from './user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<user[]> {
    const url = `${this.baseUrl}/users`;

    return this.http.get<any>(url)
      .pipe(
        tap((response: any) => {
          console.log('Admin API response:', response);
        }),
        map((response: any) => {
          // Handle both response formats
          if (response && response.users) {
            // New format with wrapped object
            return response.users;
          } else if (Array.isArray(response)) {
            // Direct array format
            return response;
          } else {
            throw new Error('Invalid response format from server');
          }
        }),
        catchError((error: any) => {
          console.error('Error from admin API:', error);
          let errorMessage = 'Failed to retrieve users';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updateUserStatus(userId: number, status: string): Observable<any> {
    const url = `${this.baseUrl}/updateUserStatus`;
    const requestData = {
      userId: userId,
      status: status
    };

    return this.http.post(url, requestData)
      .pipe(
        tap((response: any) => {
          console.log('User status updated successfully:', response);
        }),
        catchError((error: any) => {
          console.error('Error updating user status:', error);
          let errorMessage = 'Failed to update user status';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getPendingTransactions(): Observable<any> {
    const url = `${environment.apiUrl}/approval/pending`;
    const token = localStorage.getItem('jwtToken');
    const headers = { 'Authorization': `Bearer ${token}` };

    return this.http.get<any>(url, { headers })
      .pipe(
        tap((response: any) => {
          console.log('Pending transactions response:', response);
        }),
        map((response: any) => {
          // Handle both response formats
          if (response && response.transactionRequests) {
            // New format with wrapped object
            return { transactions: response.transactionRequests };
          } else if (response && Array.isArray(response.transactionRequests)) {
            // Direct array format
            return { transactions: response.transactionRequests };
          } else {
            return { transactions: [] };
          }
        }),
        catchError((error: any) => {
          console.error('Error fetching pending transactions:', error);
          return throwError(() => new Error('Failed to retrieve pending transactions'));
        })
      );
  }
}
