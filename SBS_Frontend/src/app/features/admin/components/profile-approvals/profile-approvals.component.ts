import { Component, OnInit } from '@angular/core';
import { ProfileRequestService, ProfileUpdateRequest } from '../../../../core/services/profile-request.service';

@Component({
  selector: 'app-profile-approvals',
  templateUrl: './profile-approvals.component.html',
  styleUrls: ['./profile-approvals.component.css']
})
export class ProfileApprovalsComponent implements OnInit {
  pendingRequests: ProfileUpdateRequest[] = [];
  loading: boolean = false;
  error: string = '';
  showDenyModal: boolean = false;
  denyReason: string = '';
  selectedRequestId: number | null = null;

  constructor(private profileRequestService: ProfileRequestService) {}

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.loading = true;
    this.error = '';

    this.profileRequestService.getPendingProfileRequests().subscribe({
      next: (response) => {
        this.pendingRequests = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending profile requests:', error);
        this.error = 'Failed to load pending profile requests';
        this.loading = false;
      }
    });
  }

  approveRequest(requestId: number) {
    this.profileRequestService.approveProfileRequest(requestId).subscribe({
      next: (response) => {
        console.log('Profile request approved:', response);
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error approving profile request:', error);
        this.error = 'Failed to approve profile request';
      }
    });
  }

  denyRequestWithReason(requestId: number) {
    this.selectedRequestId = requestId;
    this.denyReason = '';
    this.showDenyModal = true;
  }

  closeDenyModal() {
    this.showDenyModal = false;
    this.selectedRequestId = null;
    this.denyReason = '';
  }

  confirmDeny() {
    if (!this.selectedRequestId) return;
    
    if (!this.denyReason.trim()) {
      this.error = 'Please provide a reason for denial';
      return;
    }

    this.profileRequestService.rejectProfileRequest(this.selectedRequestId, this.denyReason).subscribe({
      next: (response) => {
        console.log('Profile request denied:', response);
        this.closeDenyModal();
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error denying profile request:', error);
        this.error = 'Failed to deny profile request';
      }
    });
  }

  confirmDenyRequest() {
    this.confirmDeny();
  }

  denyRequest(requestId: number, reason: string) {
    if (!reason.trim()) {
      this.error = 'Please provide a reason for denial';
      return;
    }

    this.profileRequestService.rejectProfileRequest(requestId, reason).subscribe({
      next: (response) => {
        console.log('Profile request denied:', response);
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error denying profile request:', error);
        this.error = 'Failed to deny profile request';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
} 