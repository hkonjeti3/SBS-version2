import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export interface ProfileUpdateRequest {
  id?: number;
  userId: number;
  requestType: string;
  currentValue: string;
  requestedValue: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileRequestService {
  private baseUrl = environment.apiUrl || 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {}

  // Submit a new profile update request
  submitProfileUpdateRequest(request: ProfileUpdateRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/profile-update-request`, request);
  }

  // Get user's profile update requests
  getUserProfileRequests(userId: number): Observable<ProfileUpdateRequest[]> {
    return this.http.get<ProfileUpdateRequest[]>(`${this.baseUrl}/profile-update-request/user/${userId}`);
  }

  // Get all pending profile update requests (for admin/internal users)
  getPendingProfileRequests(): Observable<ProfileUpdateRequest[]> {
    return this.http.get<any>(`${this.baseUrl}/approval/pending`).pipe(
      map(response => response.profileRequests || [])
    );
  }

  // Approve a profile update request
  approveProfileRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval/profile/approve/${requestId}`, {});
  }

  // Reject a profile update request
  rejectProfileRequest(requestId: number, reason?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval/profile/reject/${requestId}`, { reason });
  }

  // Get notification count for user
  getNotificationCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notifications/count/${userId}`);
  }

  // Get user notifications
  getUserNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/user/${userId}`);
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/read/${notificationId}`, {});
  }
} 