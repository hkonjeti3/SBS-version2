// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/internal/Observable';
// import { user } from './user';

// @Injectable({
//   providedIn: 'root'
// })
// export class RegisterService {
//   private baseUrl = 'http://localhost:8080/api/v1/';
//   // private apiUrl = 'http://localhost:8080/api/v1/createOrUpdateUser'; // replace with your actual backend API URL
//   httpClient: any;

//   constructor(private http: HttpClient) {}
//   private extractData(res: Response) {
//     let body = res.json();
//           return body || {};
//       }
//   register(user: user): Observable<any> {
//     let url = this.baseUrl + 'createOrUpdateUser';
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//       })
//     };
//     return this.httpClient.post(url, user, httpOptions);
    
//   }
  
// }

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { user } from './user';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private baseUrl = 'http://localhost:8080/api/v1/';

  constructor(private http: HttpClient) {}

  register(user: user): Observable<any> {
    const url = this.baseUrl + 'createOrUpdateUser';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text' as 'json' // Specify the response type as text
    };
    return this.http.post(url, user, httpOptions)
      .pipe(
        catchError((error: any) => {
          console.error('Error from backend:', error);
          return throwError(error);
        })
      );
    
}
}
