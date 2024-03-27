// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map, tap } from 'rxjs/operators';
// import { transaction } from './transaction'; // Adjust the import path as necessary

// @Injectable({
//   providedIn: 'root'
// })
// export class CreditService {
//   private baseUrl = 'http://localhost:8080/api/v1/account/';
//   constructor(private http: HttpClient) { }

//   performTransaction(transactionType: 'CREDIT' | 'DEBIT', transactionData: transaction): Observable<any> {
//     const url = `${this.baseUrl}${transactionType}/request`;
//     console.log(transactionData, transactionType, url);
//     return this.http.post(url, transactionData, {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//       })
//     }).pipe(
//       map(response => JSON.parse(response)),
//       tap(response => console.log(`Transaction ${transactionType} processed: `, response)),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: any) {
//     console.error('Service error:', error);
//     return throwError(() => new Error('Error occurred during the transaction'));
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { transaction } from './transaction'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private baseUrl = 'http://localhost:8080/api/v1/account/';
  constructor(private http: HttpClient) { }

  performTransaction(transactionType: 'CREDIT' | 'DEBIT', transactionData: transaction): Observable<any> {
    const url = `${this.baseUrl}${transactionType}/request`;
    console.log(transactionData, transactionType, url);
    return this.http.post(url, transactionData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),  responseType: 'text' as 'json'
    })
    // }).pipe(
    //   tap(response => console.log(`Transaction ${transactionType} processed: `, response)),
    //   catchError(this.handleError)
    // );
  }

  private handleError(error: any) {
    console.error('Service error:', error);
    return throwError(() => new Error('Error occurred during the transaction'));
  }
}
