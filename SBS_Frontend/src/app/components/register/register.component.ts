import { RegisterService } from './../../services/register.service';
// register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
//import { RegisterService } from '../../services/register.service';
import { passwordMatchValidator } from '../../shared/password-match.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    emailAddress: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required]
  }, {
    validators: passwordMatchValidator
  });
  RegisterService: any;

  constructor(
    private fb: FormBuilder,
    RegisterService : RegisterService
  ) {}

  get firstName() {
    return this.registerForm.controls['firstName'];
  }

  get lastName() {
    return this.registerForm.controls['lastName'];
  }

  get username() {
    return this.registerForm.controls['username'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  get phoneNumber() {
    return this.registerForm.controls['phoneNumber'];
  }

  get email() {
    return this.registerForm.controls['emailAddress'];
  }

  get address() {
    return this.registerForm.controls['address'];
  }

  signup(): void {
    const user = this.registerForm.value;

    this.RegisterService.signup(user)
      .subscribe(
        (        response: any) => {
          console.log('User signed up successfully!', response);
          // Handle success, e.g., redirect to login page
        },
        (        error: any) => {
          console.error('Error signing up:', error);
          // Handle error, e.g., display error message
        }
      );
  }
}
