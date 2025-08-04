import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  relatedId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications/user/${userId}`);
  }

  getUnreadNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications/unread/${userId}`);
  }

  getNotificationCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/notifications/unread-count/${userId}`);
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/mark-read/${notificationId}`, {});
  }

  markAllAsRead(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/notifications/mark-all-read/${userId}`, {});
  }

  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notifications/${notificationId}`);
  }
} 