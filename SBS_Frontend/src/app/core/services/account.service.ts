import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AccountRequest {
  id?: number;
  userId: number;
  accountType: string;
  initialBalance: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = environment.apiUrl || 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {}

  // Get user accounts
  getUserAccounts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/accounts/user/${userId}`);
  }

  // Submit account creation request
  submitAccountRequest(request: AccountRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/account-request`, request);
  }

  // Get user's account requests
  getUserAccountRequests(userId: number): Observable<AccountRequest[]> {
    return this.http.get<AccountRequest[]>(`${this.baseUrl}/account-request/user/${userId}`);
  }

  // Get all pending account requests (for admin/internal users)
  getPendingAccountRequests(): Observable<AccountRequest[]> {
    return this.http.get<any>(`${this.baseUrl}/approval/pending`).pipe(
      map(response => response.accountRequests || [])
    );
  }

  // Approve account request
  approveAccountRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval/account/approve/${requestId}`, {});
  }

  // Reject account request
  rejectAccountRequest(requestId: number, reason?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval/account/reject/${requestId}`, { reason });
  }

  // Create account (for approved requests)
  createAccount(accountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/accounts`, accountData);
  }

  // Update account
  updateAccount(accountId: number, accountData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/accounts/${accountId}`, accountData);
  }

  // Get account details
  getAccountDetails(accountId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts/${accountId}`);
  }

  // Get all accounts (for admin dashboard)
  getAllAccounts(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/accounts`);
  }

  // Update account status
  updateAccountStatus(accountId: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/account/updateStatus/${accountId}`, { status });
  }
}
