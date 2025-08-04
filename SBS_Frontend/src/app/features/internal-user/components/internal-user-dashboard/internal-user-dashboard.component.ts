import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  status: string;
  timestamp: Date;
}

@Component({
  selector: 'app-internal-user-dashboard',
  templateUrl: './internal-user-dashboard.component.html',
  styleUrls: ['./internal-user-dashboard.component.css']
})
export class InternalUserDashboardComponent implements OnInit {
  // Dashboard statistics
  pendingTransactions: number = 0;
  pendingProfileUpdates: number = 0;
  pendingAccountRequests: number = 0;
  approvedToday: number = 0;

  // Recent activities
  recentActivities: Activity[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('InternalUserHomeComponent initialized');
    this.loadDashboardData();
    this.loadRecentActivities();
  }

  private loadDashboardData(): void {
    // TODO: Replace with actual API calls
    this.pendingTransactions = 5;
    this.pendingProfileUpdates = 3;
    this.pendingAccountRequests = 2;
    this.approvedToday = 12;
    
    console.log('Dashboard data loaded:', {
      pendingTransactions: this.pendingTransactions,
      pendingProfileUpdates: this.pendingProfileUpdates,
      pendingAccountRequests: this.pendingAccountRequests,
      approvedToday: this.approvedToday
    });
  }

  private loadRecentActivities(): void {
    // TODO: Replace with actual API calls
    this.recentActivities = [
      {
        id: 1,
        type: 'transaction',
        title: 'Transaction Approved',
        description: 'Approved transfer of $500 from John Doe to Jane Smith',
        status: 'approved',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'profile',
        title: 'Profile Update Rejected',
        description: 'Rejected profile update request for user ID 12345',
        status: 'rejected',
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: 3,
        type: 'account',
        title: 'Account Request Approved',
        description: 'Approved new savings account request for user ID 67890',
        status: 'approved',
        timestamp: new Date(Date.now() - 7200000) // 2 hours ago
      }
    ];
    
    console.log('Recent activities loaded:', this.recentActivities);
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'transaction': 'pi pi-list',
      'profile': 'pi pi-user-edit',
      'account': 'pi pi-credit-card'
    };
    return iconMap[type] || 'pi pi-info-circle';
  }

  navigateToTransactions(): void {
    console.log('Navigating to transaction requests');
    this.router.navigate(['/internal-transactions']);
  }

  navigateToProfileUpdates(): void {
    console.log('Navigating to profile updates');
    this.router.navigate(['/internal-profile-updates']);
  }

  navigateToAccountRequests(): void {
    console.log('Navigating to account requests');
    this.router.navigate(['/internal-accounts']);
  }

  viewReports(): void {
    console.log('Navigating to reports');
    // TODO: Implement reports page
    alert('Reports functionality coming soon!');
  }
}
