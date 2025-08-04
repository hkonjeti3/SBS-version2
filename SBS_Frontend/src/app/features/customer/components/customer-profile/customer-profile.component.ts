
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { ProfileRequestService, ProfileUpdateRequest } from '../../../../core/services/profile-request.service';
import { Router, NavigationEnd } from '@angular/router';
import { decodeToken } from '../../../../core/utils/jwt-helper';
import { user } from '../../../../core/services/user';
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserDataService } from '../../../../core/services/user-data.service';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnInit, OnDestroy {
  userData!: user;
  token: any;
  isAdmin: boolean = false;
  isInternalUser: boolean = false;

  // Profile update request form
  showUpdateForm: boolean = false;
  updateForm!: FormGroup;
  selectedField: string = '';
  isSubmitting: boolean = false;

  // User's profile update requests
  userRequests: ProfileUpdateRequest[] = [];
  loadingRequests: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService, 
    private profileRequestService: ProfileRequestService,
    private router: Router,
    private authGuard: AuthGuard,
    private formBuilder: FormBuilder,
    private userDataService: UserDataService
  ) {
    // Listen for navigation events to refresh data when returning to profile page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      if (event.url.includes('/customer/profile')) {
        console.log('Navigated to profile page, refreshing user data');
        this.refreshUserData();
      }
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken') || '{}';
    
    const decodedToken = decodeToken(this.token);
    console.log('Profile component - decoded token:', decodedToken);
    
    // Determine user type for header display
    this.isAdmin = this.authGuard.isAdmin();
    this.isInternalUser = this.authGuard.isInternalUser();
    
    console.log('Profile component - user type:', {
      isAdmin: this.isAdmin,
      isInternalUser: this.isInternalUser,
      role: decodedToken?.role
    });
    
    if (decodedToken?.userId) {
      this.loadUserData(decodedToken.userId);
    }

    this.initUpdateForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(userId: number): void {
    this.userService.getUserData(userId)
      .subscribe(
        (data: any) => {
          console.log('Profile data loaded:', data);
          this.userData = data;
          this.loadUserRequests();
          
          // Force refresh UserDataService to update header components immediately
          this.userDataService.forceRefreshUserData();
        },
        (error: any) => {
          console.error('Error fetching user data:', error);
        }
      );
  }

  // Method to refresh user data - can be called when returning to profile page
  public refreshUserData(): void {
    const decodedToken = decodeToken(this.token);
    if (decodedToken?.userId) {
      console.log('Refreshing user data for user ID:', decodedToken.userId);
      this.loadUserData(decodedToken.userId);
    }
  }

  // Method to manually refresh header data for immediate testing
  public refreshHeaderData(): void {
    console.log('Manually refreshing header data...');
    this.userDataService.forceRefreshUserData();
    alert('Header data refreshed! Check the header for updated name.');
  }

  private initUpdateForm(): void {
    this.updateForm = this.formBuilder.group({
      field: ['', Validators.required],
      currentValue: ['', Validators.required],
      newValue: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  private loadUserRequests(): void {
    if (this.userData?.userId) {
      this.loadingRequests = true;
      this.profileRequestService.getUserProfileRequests(this.userData.userId)
        .subscribe({
          next: (requests) => {
            this.userRequests = requests;
            this.loadingRequests = false;
            console.log('User profile requests loaded:', requests);
          },
          error: (error) => {
            console.error('Error loading profile requests:', error);
            this.loadingRequests = false;
          }
        });
    }
  }

  openUpdateForm(field: string): void {
    this.selectedField = field;
    this.showUpdateForm = true;
    
    // Set current value based on selected field
    let currentValue = '';
    switch (field) {
      case 'firstName':
        currentValue = this.userData.firstName || '';
        break;
      case 'lastName':
        currentValue = this.userData.lastName || '';
        break;
      case 'emailAddress':
        currentValue = this.userData.emailAddress || '';
        break;
      case 'phoneNumber':
        currentValue = this.userData.phoneNumber || '';
        break;
      case 'address':
        currentValue = this.userData.address || '';
        break;
    }

    this.updateForm.patchValue({
      field: field,
      currentValue: currentValue,
      newValue: '',
      reason: ''
    });
  }

  closeUpdateForm(): void {
    this.showUpdateForm = false;
    this.updateForm.reset();
  }

  submitProfileUpdateRequest(): void {
    if (this.updateForm.valid && this.userData?.userId) {
      this.isSubmitting = true;
      
      const formValue = this.updateForm.value;
      const request: ProfileUpdateRequest = {
        userId: this.userData.userId,
        requestType: this.getRequestType(formValue.field),
        currentValue: formValue.currentValue,
        requestedValue: formValue.newValue,
        reason: formValue.reason,
        status: 'Pending'
      };

      this.profileRequestService.submitProfileUpdateRequest(request)
        .subscribe({
          next: (response) => {
            console.log('Profile update request submitted:', response);
            this.isSubmitting = false;
            this.closeUpdateForm();
            this.loadUserRequests(); // Reload requests
            alert('Profile update request submitted successfully! It will be reviewed by an administrator.');
          },
          error: (error) => {
            console.error('Error submitting profile update request:', error);
            this.isSubmitting = false;
            alert('Failed to submit profile update request. Please try again.');
          }
        });
    }
  }

  private getRequestType(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'firstName': 'First Name Update',
      'lastName': 'Last Name Update',
      'emailAddress': 'Email Address Update',
      'phoneNumber': 'Phone Number Update',
      'address': 'Address Update'
    };
    return fieldMap[field] || 'Profile Update';
  }

  getFieldDisplayName(field: string): string {
    const fieldMap: { [key: string]: string } = {
      'firstName': 'First Name',
      'lastName': 'Last Name',
      'emailAddress': 'Email Address',
      'phoneNumber': 'Phone Number',
      'address': 'Address'
    };
    return fieldMap[field] || field;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'status-approved';
      case 'Rejected':
        return 'status-rejected';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  updateProfile(): void {
    // Redirect to a separate update page or use a modal for updating profile details
    this.router.navigate(['update'], { state: { userData: this.userData } });
  }

  deleteProfile(): void {
    // Implement logic for deleting the profile
    // For simplicity, let's just reset the user data
    this.userService.updateUserData({});
    this.router.navigate(['#']);
  }
}
