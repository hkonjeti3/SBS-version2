import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { decodeToken } from '../../../../core/utils/jwt-helper';

@Component({
  selector: 'app-header-internal',
  templateUrl: './internal-user-header.component.html',
  styleUrls: ['./internal-user-header.component.css']
})
export class InternalUserHeaderComponent implements OnInit {
  userFirstName: string = 'Internal User';
  isMobileMenuOpen: boolean = false;
  showUserDropdown: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('HeaderInternalComponent initialized');
    this.loadUserData();
  }

  private loadUserData() {
    console.log('Loading internal user data...');
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        // Use firstName if available, otherwise use username, fallback to 'Internal User'
        this.userFirstName = decodedToken.firstName || decodedToken.username || 'Internal User';
        console.log('Internal user data loaded:', { 
          firstName: decodedToken.firstName, 
          username: decodedToken.username,
          role: decodedToken.role 
        });
      }
    } else {
      console.log('No JWT token found in localStorage');
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
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