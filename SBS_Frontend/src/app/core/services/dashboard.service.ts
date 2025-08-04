import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  pendingApprovals: number;
}

export interface PendingRequest {
  id: number;
  type: string;
  status: string;
  createdAt: string;
  requesterName: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  timestamp: string;
  userId: number;
  userName: string;
}

export interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDashboardStats(userId: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/${userId}`);
  }

  getPendingRequests(): Observable<PendingRequest[]> {
    return this.http.get<PendingRequest[]>(`${this.baseUrl}/approval/pending`);
  }

  getActivityLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.baseUrl}/dashboard/activity/logs`);
  }
  
  getUserActivityLogs(userId: number): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.baseUrl}/dashboard/activity/logs/${userId}`);
  }

  getUserActivityLogsSinceLastLogin(userId: number): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.baseUrl}/dashboard/activity/logs/${userId}/since-login`);
  }

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications/user/${userId}`);
  }

  approveRequest(requestId: number, type: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval/${type}/approve/${requestId}`, {});
  }

  rejectRequest(requestId: number, type: string, reason?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/approval/${type}/reject/${requestId}`, { reason });
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/mark-read/${notificationId}`, {});
  }

  getNotificationCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notifications/unread-count/${userId}`);
  }
} 