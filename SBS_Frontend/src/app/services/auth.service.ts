import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  login(email: string, password: string): void {
    // Authenticate user (replace with actual authentication logic)
    const user = this.authenticateUser(email, password);

    if (user) {
      // Store user information (e.g., role)
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Redirect based on user role
      if (user.role === 'user') {
        this.router.navigate(['/home']);
      } else if (user.role === 'internal') {
        this.router.navigate(['/intuser-home']);
      }
    } else {
      console.log("Invalid credentials");
    }
  }

  private authenticateUser(email: string, password: string): any {
    // Dummy user data (replace with actual authentication logic)
    const users = [
      { id: 1, email: 'user@example.com', password: 'user', role: 'user' },
      { id: 2, email: 'internal@example.com', password: 'internal', role: 'internal' }
    ];

    return users.find(user => user.email === email && user.password === password);
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    // Retrieve current user from local storage
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  isLoggedIn(): boolean {
    // Check if user is logged in
    return !!localStorage.getItem('currentUser');
  }
}
