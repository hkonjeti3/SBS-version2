import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { decodeToken } from '../../../core/utils/jwt-helper';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: boolean = false;
  showOtpModal: boolean = false;
  userEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        this.navigateBasedOnRole(decodedToken.role);
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const loginData = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.userService.login(loginData).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          console.log('Login response:', response);
          
          if (response && response.token) {
            // Store the token
            localStorage.setItem('jwtToken', response.token);
            
            // Show OTP modal
            this.userEmail = response.emailAddress || this.loginForm.value.username;
            this.showOtpModal = true;
          } else {
            alert('Login successful but no token received');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          let errorMessage = 'Login failed. Please try again.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          // Check if it's a deactivated account error
          if (errorMessage.includes('deactivated') || errorMessage.includes('Deactivated')) {
            errorMessage = 'Account is deactivated. Please contact administrator.';
          }
          
          alert(errorMessage);
        }
      });
    }
  }

  onOtpVerified(event: any) {
    if (event.success) {
      console.log('OTP verified successfully');
      // The OTP component will handle navigation
    }
  }

  onOtpModalClosed() {
    this.showOtpModal = false;
  }

  private navigateBasedOnRole(role: number) {
    if (role === 4) {
      this.router.navigate(['/home-admin']);
    } else if (role === 6) {
      this.router.navigate(['/intuser-home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}