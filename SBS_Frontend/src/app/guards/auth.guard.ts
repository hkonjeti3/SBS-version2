import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    const roles = (route.data as any).roles; // Explicitly define the type of route.data
    if (this.authService.isLoggedIn() && roles.includes(currentUser.role)) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
