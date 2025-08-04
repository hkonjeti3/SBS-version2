import { Component, OnInit } from '@angular/core';
import { ProfileRequestService, ProfileUpdateRequest } from '../../../../core/services/profile-request.service';

@Component({
  selector: 'app-internal-user-profile-approval',
  templateUrl: './internal-user-profile-approval.component.html',
  styleUrls: ['./internal-profile-updates.component.css']
})
export class InternalUserProfileApprovalComponent implements OnInit {
  pendingProfileUpdates: ProfileUpdateRequest[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private profileRequestService: ProfileRequestService) {}

  ngOnInit(): void {
    console.log('InternalProfileUpdatesComponent initialized');
    this.loadPendingProfileUpdates();
  }

  private loadPendingProfileUpdates(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Loading pending profile updates...');
    console.log('API URL:', `${this.profileRequestService['baseUrl']}/approval/pending`);

    this.profileRequestService.getPendingProfileRequests().subscribe({
      next: (requests) => {
        console.log('Profile requests response:', requests);
        this.pendingProfileUpdates = requests;
        this.isLoading = false;
        console.log('Pending profile updates loaded:', requests);
      },
      error: (error) => {
        console.error('Error loading pending profile updates:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile update requests. Please try again.';
      }
    });
  }

  approveProfileUpdate(requestId: number): void {
    console.log('Approving profile update request:', requestId);
    
    this.profileRequestService.approveProfileRequest(requestId).subscribe({
      next: (response) => {
        console.log('Profile update request approved:', response);
        alert('Profile update request approved successfully!');
        this.loadPendingProfileUpdates(); // Reload the list
      },
      error: (error) => {
        console.error('Error approving profile update request:', error);
        alert('Failed to approve profile update request. Please try again.');
      }
    });
  }

  rejectProfileUpdate(requestId: number): void {
    console.log('Rejecting profile update request:', requestId);
    
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    this.profileRequestService.rejectProfileRequest(requestId, reason || undefined).subscribe({
      next: (response) => {
        console.log('Profile update request rejected:', response);
        alert('Profile update request rejected successfully!');
        this.loadPendingProfileUpdates(); // Reload the list
      },
      error: (error) => {
        console.error('Error rejecting profile update request:', error);
        alert('Failed to reject profile update request. Please try again.');
      }
    });
  }

  retryLoadRequests(): void {
    this.loadPendingProfileUpdates();
  }
} 