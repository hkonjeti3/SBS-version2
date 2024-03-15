import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';
import { user } from '../../services/user';
import {decodeToken} from '../../util/jwt-helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });


  constructor(private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router) {}

  get username() {
    return this.loginForm.controls['username'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  onSubmit() {
    const username = this.username.value || '';
    const password = this.password.value || '';
  
    if (this.loginForm.valid) {
      this.registerService.login(username, password)
        .subscribe(
          (response: any) => {
            if (response && response.token) {
              // Store the JWT token in local storage
              localStorage.setItem('jwtToken', response.token);
            
              // Decode the JWT token to extract user information
              const decodedToken = decodeToken(response.token);
              console.log(decodedToken);
              if (decodedToken) {
                console.log('Decoded token:', decodedToken);
            
                // Redirect based on user role or other conditions
                if (decodedToken.email) {
                  this.router.navigate(['/otp-verification'], { queryParams: { email: decodedToken.email } });
                } else {
                  this.router.navigate(['/home']);
                }
              } else {
                console.error('Failed to decode JWT token');
              }
            } else {
              console.error('JWT token not found in response:', response);
            }
          },
          (error) => {
            console.error('Login failed:', error);
          }
        );
    }
  }
  
}