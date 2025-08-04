import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { decodeToken } from '../../../../core/utils/jwt-helper';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserDataService, UserData } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit, OnDestroy {
  userFirstName: string = 'Admin';
  isMobileMenuOpen: boolean = false;
  showUserDropdown: boolean = false;
  showApprovalsDropdown: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userDataService: UserDataService
  ) {
    // Listen for navigation events to refresh user data
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      // Refresh user data when navigating to any admin page
      if (event.url.includes('/admin/') || event.url.includes('/customer/')) {
        console.log('Navigation detected, refreshing admin header user data');
        this.refreshUserData();
      }
    });
  }

  ngOnInit() {
    console.log('HeaderAdminComponent initialized');
    this.loadUserData();
    
    // Subscribe to user data changes
    this.userDataService.getUserDataObservable().pipe(
      takeUntil(this.destroy$)
    ).subscribe((userData: UserData | null) => {
      if (userData) {
        this.userFirstName = userData.firstName || userData.username || 'Admin';
        console.log('Admin header updated with new user data:', userData);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData() {
    console.log('Loading admin user data...');
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        // Use firstName if available, otherwise use username, fallback to 'Admin'
        this.userFirstName = decodedToken.firstName || decodedToken.username || 'Admin';
        console.log('Admin user data loaded:', { 
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
    console.log('Refreshing admin header user data...');
    
    // Force refresh from server instead of relying on JWT token
    this.userDataService.forceRefreshUserData();
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
    // Close approvals dropdown when user dropdown is opened
    if (this.showUserDropdown) {
      this.showApprovalsDropdown = false;
    }
  }

  toggleApprovalsDropdown() {
    this.showApprovalsDropdown = !this.showApprovalsDropdown;
    // Close user dropdown when approvals dropdown is opened
    if (this.showApprovalsDropdown) {
      this.showUserDropdown = false;
    }
  }

  isApprovalsActive(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/admin/approvals/');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}