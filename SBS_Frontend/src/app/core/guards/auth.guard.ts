import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { decodeToken } from '../utils/jwt-helper';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.log('AuthGuard checking route:', state.url);
    console.log('Route data:', route.data);
    
    // Check if user is authenticated
    if (!this.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check if token is valid
    if (!this.isTokenValid()) {
      console.log('Token not valid, clearing and redirecting to login');
      this.clearInvalidToken();
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Check role-based access if required
    if (route.data['roles']) {
      console.log('Checking role-based access for roles:', route.data['roles']);
      if (!this.hasRequiredRole(route.data['roles'])) {
        console.log('User does not have required role, redirecting to appropriate home');
        // Redirect to appropriate home page based on user role
        const userRole = this.getCurrentUserRole();
        if (userRole === 4) { // Admin
          this.router.navigate(['/home-admin']);
        } else if (userRole === 6) { // Internal User
          this.router.navigate(['/intuser-home']);
        } else { // Regular User
          this.router.navigate(['/home']);
        }
        return false;
      }
    }

    console.log('AuthGuard passed, allowing access');
    return true;
  }

  /**
   * Checks if user is authenticated
   */
  private isAuthenticated(): boolean {
    const token = localStorage.getItem('jwtToken');
    return !!token;
  }

  /**
   * Validates JWT token
   */
  private isTokenValid(): boolean {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.log('No token found in localStorage');
        return false;
      }

      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        console.log('Failed to decode token');
        return false;
      }

      console.log('Decoded token:', decodedToken);

      // Check if token is expired
      if (decodedToken.exp) {
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log('Token is expired');
          return false;
        }
      }

      // Check if token has required fields
      if (!decodedToken.userId) {
        console.log('Token missing userId');
        return false;
      }

      console.log('Token is valid');
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Checks if user has required role
   */
  private hasRequiredRole(requiredRoles: string[] | number[]): boolean {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return false;

      const decodedToken = decodeToken(token);
      if (!decodedToken || !decodedToken.role) return false;

      const userRole = decodedToken.role;
      console.log('User role:', userRole, 'Required roles:', requiredRoles);
      
      // Check if user role matches any required role
      const hasRole = requiredRoles.some(role => {
        if (typeof role === 'number') {
          return userRole === role;
        }
        // Map string roles to numeric roles
        const roleMapping: { [key: string]: number } = {
          'user': 2,
          'admin': 4,
          'internal': 6
        };
        const mappedRole = roleMapping[role];
        return mappedRole === userRole;
      });
      
      console.log('Has required role:', hasRole);
      return hasRole;
    } catch (error) {
      console.error('Role validation error:', error);
      return false;
    }
  }

  /**
   * Clears invalid token
   */
  private clearInvalidToken(): void {
    localStorage.removeItem('jwtToken');
    // In production, you might want to clear other sensitive data
    sessionStorage.clear();
  }

  /**
   * Gets current user role
   */
  public getCurrentUserRole(): number | null {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return null;

      const decodedToken = decodeToken(token);
      return decodedToken?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  /**
   * Gets current user ID
   */
  public getCurrentUserId(): number | null {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) return null;

      const decodedToken = decodeToken(token);
      return decodedToken?.userId || null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  }

  /**
   * Checks if user is admin
   */
  public isAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 4; // Assuming 4 is admin role
  }

  /**
   * Checks if user is internal user
   */
  public isInternalUser(): boolean {
    const role = this.getCurrentUserRole();
    return role === 6; // Assuming 6 is internal user role
  }

  /**
   * Checks if user is regular user
   */
  public isRegularUser(): boolean {
    const role = this.getCurrentUserRole();
    return role === 2; // Assuming 2 is regular user role
  }
}
