import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin = false;
  loginSuccess = false;
  errorMessage = 'Invalid credentials';
  successMessage = 'Login successful!';

  handleLogin(username: string, password: string): void {
    // Replace this with your actual authentication logic
    if (username === 'yourUsername' && password === 'yourPassword') {
      this.invalidLogin = false;
      this.loginSuccess = true;
    } else {
      this.invalidLogin = true;
      this.loginSuccess = false;
    }
  }
}

