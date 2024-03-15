import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from '../services/register.service';

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
          this.router.navigate(['/home']);
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
