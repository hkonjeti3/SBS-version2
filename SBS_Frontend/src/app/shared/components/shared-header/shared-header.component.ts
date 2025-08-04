import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { decodeToken } from '../../../core/utils/jwt-helper';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { UserDataService, UserData } from '../../../core/services/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.css']
})
export class SharedHeaderComponent implements OnInit, OnDestroy {
  userFirstName: string = 'User';
  isMobileMenuOpen: boolean = false;
  showUserDropdown: boolean = false;
  showNotificationDropdown: boolean = false;

  // Notification properties
  notifications: Notification[] = [];
  unreadCount: number = 0;
  loadingNotifications: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private userDataService: UserDataService
  ) {
    // Listen for navigation events to refresh user data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      // Refresh user data when navigating to any page
      console.log('Navigation detected, refreshing shared header user data');
      this.refreshUserData();
    });
  }

  ngOnInit() {
    console.log('SharedHeaderComponent initialized');
    this.loadUserData();
    this.loadNotifications();
    
    // Subscribe to user data changes
    this.userDataService.getUserDataObservable().pipe(
      takeUntil(this.destroy$)
    ).subscribe((userData: UserData | null) => {
      if (userData) {
        this.userFirstName = userData.firstName || userData.username || 'User';
        console.log('Shared header updated with new user data:', userData);
      }
    });

    // Set up periodic notification count refresh (every 30 seconds)
    timer(0, 30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.refreshNotificationCount();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData() {
    console.log('Loading user data...');
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        this.userFirstName = decodedToken?.firstName || decodedToken?.username || 'User';
        console.log('User data loaded:', { 
          firstName: decodedToken.firstName, 
          username: decodedToken.username,
          role: decodedToken.role 
        });
      }
    } else {
      console.log('No JWT token found in localStorage');
    }
  }

  // Public method to refresh user data (can be called from other components)
  public refreshUserData(): void {
    console.log('Refreshing shared header user data...');
    
    // Force refresh from server instead of relying on JWT token
    this.userDataService.forceRefreshUserData();
  }

  private loadNotifications() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        this.loadingNotifications = true;
        
        // Load only unread notifications
        this.notificationService.getUnreadNotifications(decodedToken.userId).subscribe({
          next: (notifications: any) => {
            this.notifications = notifications;
            this.loadingNotifications = false;
            console.log('Unread notifications loaded:', this.notifications);
          },
          error: (error: any) => {
            console.error('Error loading notifications:', error);
            this.loadingNotifications = false;
          }
        });

        // Load notification count
        this.notificationService.getNotificationCount(decodedToken.userId).subscribe({
          next: (count: any) => {
            this.unreadCount = count;
            console.log('Notification count loaded:', count);
          },
          error: (error: any) => {
            console.error('Error loading notification count:', error);
          }
        });
      }
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) {
      this.showNotificationDropdown = false;
    }
  }

  toggleNotificationDropdown() {
    this.showNotificationDropdown = !this.showNotificationDropdown;
    if (this.showNotificationDropdown) {
      this.showUserDropdown = false;
      // Refresh notifications when dropdown is opened
      this.loadNotifications();
    }
  }

  // Method to refresh notifications (can be called from other components)
  public refreshNotifications(): void {
    console.log('Refreshing notifications...');
    this.loadNotifications();
  }

  markNotificationAsRead(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          // Remove the notification from the local array since it's now read
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
          this.unreadCount = Math.max(0, this.unreadCount - 1);
          console.log('Notification marked as read and removed from display:', notification.id);
        },
        error: (error) => {
          console.error('Error marking notification as read:', error);
        }
      });
    }
  }

  markAllNotificationsAsRead() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        this.notificationService.markAllAsRead(decodedToken.userId).subscribe({
          next: () => {
            // Clear all notifications from the display since they're all read now
            this.notifications = [];
            this.unreadCount = 0;
            console.log('All notifications marked as read and removed from display');
          },
          error: (error) => {
            console.error('Error marking all notifications as read:', error);
          }
        });
      }
    }
  }

  deleteNotification(notificationId: number) {
    // Check if the notification is unread before deleting
    const notificationToDelete = this.notifications.find(n => n.id === notificationId);
    const wasUnread = notificationToDelete && !notificationToDelete.isRead;
    
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        // Remove the notification from the list
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        // Update unread count if the deleted notification was unread
        if (wasUnread) {
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
        console.log('Notification deleted:', notificationId);
      },
      error: (error) => {
        console.error('Error deleting notification:', error);
      }
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  private refreshNotificationCount() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        this.notificationService.getNotificationCount(decodedToken.userId).subscribe({
          next: (count: any) => {
            this.unreadCount = count;
            console.log('Notification count refreshed:', count);
          },
          error: (error: any) => {
            console.error('Error refreshing notification count:', error);
          }
        });
      }
    }
  }
}

