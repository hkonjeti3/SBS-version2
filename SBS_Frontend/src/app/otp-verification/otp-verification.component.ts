import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { decodeToken } from '../util/jwt-helper';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.css']
})
export class OtpVerificationComponent implements OnInit {
  otpForm = this.fb.group({
    otp: ['', Validators.required]
  });
  email: string | null = null;
  token: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private registerService:RegisterService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || null;
      console.log(this.email)
    });
  }

  onSubmit() {
    const otp = this.otpForm.value.otp || '';
    console.log(otp)
    if(this.email){
    this.registerService.validateOtp(this.email, otp)
      .subscribe(
        (response: any) => {
          console.log('OTP validation response:', response);
          alert(response);
          this.token = localStorage.getItem('jwtToken') || '{}';
      
        const decodedToken = decodeToken(this.token);
          
        console.log(decodedToken);
        if (decodedToken?.role) {
          if (decodedToken.role === 2) {
            this.router.navigate(['/home']);
          } else if (decodedToken.role === 6) {
            this.router.navigate(['/intuser-home']);
          }
            else if (decodedToken.role === 4) {
              this.router.navigate(['/admin']);
            
          }
          
          // Handle the response as needed
        }
        // this.router.navigate(['/login']);
          // Handle the response as needed
        },
        (error: any) => {
          console.error('OTP validation error:', error);
          alert("INVALID OTP");
          this.router.navigate(['/login']);
          // Handle the error as needed
        }
      );
    
  }
  else{
    console.error('Email is null');
  }
}
}
