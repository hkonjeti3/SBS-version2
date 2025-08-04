import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { decodeToken } from '../../../core/utils/jwt-helper';

@Component({
  selector: 'app-shared-dashboard',
  templateUrl: './shared-dashboard.component.html',
  styleUrls: ['./shared-dashboard.component.css']
})
export class SharedDashboardComponent implements OnInit {
  pendingRequests: any = { accountRequests: [], profileRequests: [] };
  activityLogs: any[] = [];
  notifications: any[] = [];
  loading: boolean = false;
  unreadCount: number = 0;
  error: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  isApprover(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      return decodedToken?.role === 'Admin' || decodedToken?.role === 'InternalUser';
    }
    return false;
  }

  getTotalPendingRequests(): number {
    return (this.pendingRequests.accountRequests?.length || 0) + 
           (this.pendingRequests.profileRequests?.length || 0);
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load pending requests for approvers
    if (this.isApprover()) {
      this.dashboardService.getPendingRequests().subscribe({
        next: (data: any) => {
          this.pendingRequests = data;
          console.log('Pending requests loaded:', this.pendingRequests);
        },
        error: (error: any) => {
          console.error('Error loading pending requests:', error);
        }
      });
    }

    // Load activity logs
    this.dashboardService.getActivityLogs().subscribe({
      next: (data: any) => {
        this.activityLogs = data;
        console.log('Activity logs loaded:', this.activityLogs);
      },
      error: (error: any) => {
        console.error('Error loading activity logs:', error);
      }
    });

    // Load notifications
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        this.dashboardService.getNotifications(decodedToken.userId).subscribe({
          next: (data: any) => {
            this.notifications = data;
            console.log('Notifications loaded:', this.notifications);
          },
          error: (error: any) => {
            console.error('Error loading notifications:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
      }
    }
  }

  // Account request approval methods
  approveAccountRequest(requestId: number) {
    console.log('Approving account request:', requestId);
    this.dashboardService.approveRequest(requestId, 'account').subscribe({
      next: (response: any) => {
        console.log('Account request approved:', response);
        this.loadDashboardData(); // Reload data
      },
      error: (error: any) => {
        console.error('Error approving account request:', error);
      }
    });
  }

  rejectAccountRequest(requestId: number) {
    console.log('Rejecting account request:', requestId);
    this.dashboardService.rejectRequest(requestId, 'account', 'Rejected by approver').subscribe({
      next: (response: any) => {
        console.log('Account request rejected:', response);
        this.loadDashboardData(); // Reload data
      },
      error: (error: any) => {
        console.error('Error rejecting account request:', error);
      }
    });
  }

  // Profile request approval methods
  approveProfileRequest(requestId: number) {
    console.log('Approving profile request:', requestId);
    this.dashboardService.approveRequest(requestId, 'profile').subscribe({
      next: (response: any) => {
        console.log('Profile request approved:', response);
        this.loadDashboardData(); // Reload data
      },
      error: (error: any) => {
        console.error('Error approving profile request:', error);
      }
    });
  }

  rejectProfileRequest(requestId: number) {
    console.log('Rejecting profile request:', requestId);
    this.dashboardService.rejectRequest(requestId, 'profile', 'Rejected by approver').subscribe({
      next: (response: any) => {
        console.log('Profile request rejected:', response);
        this.loadDashboardData(); // Reload data
      },
      error: (error: any) => {
        console.error('Error rejecting profile request:', error);
      }
    });
  }

  // Notification methods
  markNotificationAsRead(notificationId: number): void {
    this.dashboardService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        // Update local notification state
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
        this.loadDashboardData(); // Reload to update unread count
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllNotificationsAsRead() {
    this.dashboardService.markNotificationAsRead(0).subscribe({
      next: (response: any) => {
        console.log('All notifications marked as read:', response);
        this.loadDashboardData(); // Reload data
      },
      error: (error: any) => {
        console.error('Error marking notifications as read:', error);
      }
    });
  }

  // Utility methods
  private showToast(message: string, type: 'success' | 'error' | 'info'): void {
    // Implement toast notification here
    // You can use a toast library or create a simple alert for now
    alert(message);
  }

  get pendingRequestsCount(): number {
    return this.pendingRequests.length;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  getActivityIcon(action: string): string {
    switch (action.toLowerCase()) {
      case 'login': return 'sign-in-alt';
      case 'logout': return 'sign-out-alt';
      case 'approve': return 'check';
      case 'reject': return 'times';
      case 'update': return 'edit';
      case 'create': return 'plus';
      default: return 'info-circle';
    }
  }
} 