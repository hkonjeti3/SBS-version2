import { Component, OnInit } from '@angular/core';
import { decodeToken } from '../../../../core/utils/jwt-helper';
import { DashboardService } from '../../../../core/services/dashboard.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent implements OnInit {
  userFirstName: string = 'User';
  currentDate: Date = new Date();
  totalAccounts: number = 0;
  totalBalance: string = '0.00';
  recentTransactions: number = 0;
  recentActivities: any[] = [];
  isLoading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadUserData();
    this.loadDashboardData();
  }

  private loadUserData() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        this.userFirstName = decodedToken.firstName || decodedToken.username || 'User';
        console.log('Home user data loaded:', { firstName: decodedToken.firstName, username: decodedToken.username });
      }
    }
  }

  private loadDashboardData() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        this.isLoading = true;
        
        this.dashboardService.getDashboardStats(decodedToken.userId).subscribe({
          next: (data: any) => {
            this.totalAccounts = data.totalAccounts || 0;
            this.totalBalance = data.totalBalance || '0.00';
            this.recentTransactions = data.recentTransactions || 0;
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading dashboard data:', error);
            this.isLoading = false;
            // Fallback to default values
            this.totalAccounts = 0;
            this.totalBalance = '0.00';
            this.recentTransactions = 0;
          }
        });

        // Load activity logs for specific user since last login
        this.dashboardService.getUserActivityLogsSinceLastLogin(decodedToken.userId).subscribe({
          next: (data: any) => {
            // Filter out duplicate activities
            const uniqueActivities = this.filterDuplicateActivities(data);
            this.recentActivities = uniqueActivities.slice(0, 4).map((activity: any) => ({
              title: activity.action || activity.description || 'Activity',
              time: new Date(activity.timestamp).toLocaleString(),
              amount: '',
              type: 'info',
              icon: 'pi pi-info-circle'
            }));
            console.log('Recent activities loaded:', this.recentActivities);
          },
          error: (error: any) => {
            console.error('Error loading activity logs since last login:', error);
            // Fallback to regular activity logs
            this.dashboardService.getUserActivityLogs(decodedToken.userId).subscribe({
              next: (data: any) => {
                const uniqueActivities = this.filterDuplicateActivities(data);
                this.recentActivities = uniqueActivities.slice(0, 4).map((activity: any) => ({
                  title: activity.action || activity.description || 'Activity',
                  time: new Date(activity.timestamp).toLocaleString(),
                  amount: '',
                  type: 'info',
                  icon: 'pi pi-info-circle'
                }));
                console.log('Recent activities loaded (fallback):', this.recentActivities);
              },
              error: (error: any) => {
                console.error('Error loading activity logs:', error);
                this.recentActivities = [];
              }
            });
          }
        });
      }
    }
  }

  filterDuplicateActivities(activities: any[]): any[] {
    const seen = new Set<string>();
    return activities.filter(activity => {
      // Create a unique key for each activity
      const key = `${activity.action}-${activity.description}-${activity.timestamp}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
