import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  description: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private baseUrl = environment.apiUrl || 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) { }

  /**
   * Get all activity logs for dashboard display
   */
  getAllActivityLogs(): Observable<ActivityLog[]> {
    const url = `${this.baseUrl}/dashboard/activity/logs`;
    
    return this.http.get<any[]>(url)
      .pipe(
        tap((response: any) => {
          console.log('Activity logs API response:', response);
        }),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.data)) {
            return response.data;
          } else {
            console.warn('Invalid activity logs response format, returning empty array');
            return [];
          }
        }),
        catchError((error: any) => {
          console.error('Error from activity logs API:', error);
          // Return empty array instead of throwing error for better UX
          console.warn('Returning empty array due to error:', error.message);
          return of([]);
        })
      );
  }

  /**
   * Get activity logs for a specific user
   */
  getUserActivityLogs(userId: number, limit?: number): Observable<ActivityLog[]> {
    let url = `${this.baseUrl}/dashboard/activity/logs/${userId}`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    
    return this.http.get<any[]>(url)
      .pipe(
        tap((response: any) => {
          console.log('User activity logs API response:', response);
        }),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.data)) {
            return response.data;
          } else {
            console.warn('Invalid user activity logs response format, returning empty array');
            return [];
          }
        }),
        catchError((error: any) => {
          console.error('Error from user activity logs API:', error);
          // Return empty array instead of throwing error for better UX
          console.warn('Returning empty array due to error:', error.message);
          return of([]);
        })
      );
  }

  /**
   * Get activity logs for a specific user since their last login
   */
  getUserActivityLogsSinceLastLogin(userId: number): Observable<ActivityLog[]> {
    const url = `${this.baseUrl}/dashboard/activity/logs/${userId}/since-login`;
    
    return this.http.get<any[]>(url)
      .pipe(
        tap((response: any) => {
          console.log('User activity logs since login API response:', response);
        }),
        map((response: any) => {
          if (Array.isArray(response)) {
            return response;
          } else if (response && Array.isArray(response.data)) {
            return response.data;
          } else {
            console.warn('Invalid user activity logs since login response format, returning empty array');
            return [];
          }
        }),
        catchError((error: any) => {
          console.error('Error from user activity logs since login API:', error);
          // Return empty array instead of throwing error for better UX
          console.warn('Returning empty array due to error:', error.message);
          return of([]);
        })
      );
  }

  /**
   * Log an activity (for admin actions)
   */
  logActivity(userId: number, action: string, description: string, details?: string): Observable<any> {
    const activityData = {
      userId: userId,
      action: action,
      description: description,
      details: details
    };
    
    return this.http.post(`${this.baseUrl}/activity/log`, activityData);
  }

  /**
   * Convert activity log to dashboard activity format
   */
  convertToDashboardActivity(activityLog: ActivityLog): any {
    const now = new Date();
    const activityTime = new Date(activityLog.timestamp);
    const timeDiff = now.getTime() - activityTime.getTime();
    
    // Calculate time ago
    let timeAgo = '';
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      timeAgo = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      timeAgo = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      timeAgo = `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    // Determine activity type and icon based on action
    let type = 'info';
    let icon = 'pi pi-info-circle';
    
    if (activityLog.action.toLowerCase().includes('login') || activityLog.action.toLowerCase().includes('auth')) {
      type = 'security';
      icon = 'pi pi-shield';
    } else if (activityLog.action.toLowerCase().includes('transaction') || activityLog.action.toLowerCase().includes('transfer')) {
      type = 'transaction';
      icon = 'pi pi-exchange';
    } else if (activityLog.action.toLowerCase().includes('account') || activityLog.action.toLowerCase().includes('create')) {
      type = 'account';
      icon = 'pi pi-credit-card';
    } else if (activityLog.action.toLowerCase().includes('user') || activityLog.action.toLowerCase().includes('register')) {
      type = 'user';
      icon = 'pi pi-user-plus';
    } else if (activityLog.action.toLowerCase().includes('approve') || activityLog.action.toLowerCase().includes('reject')) {
      type = 'approval';
      icon = 'pi pi-check-circle';
    }

    return {
      type: type,
      title: activityLog.action,
      description: activityLog.description,
      time: timeAgo,
      icon: icon,
      details: activityLog.details
    };
  }
} 