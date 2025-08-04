import { Component, OnInit } from '@angular/core';
import { AccountService, AccountRequest } from '../../../../core/services/account.service';

@Component({
  selector: 'app-account-approvals',
  templateUrl: './account-approvals.component.html',
  styleUrls: ['./account-approvals.component.css']
})
export class AccountApprovalsComponent implements OnInit {
  pendingRequests: AccountRequest[] = [];
  loading: boolean = false;
  error: string = '';
  showDenyModal: boolean = false;
  denyReason: string = '';
  selectedRequestId: number | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.loadPendingRequests();
  }

  loadPendingRequests() {
    this.loading = true;
    this.error = '';

    this.accountService.getPendingAccountRequests().subscribe({
      next: (response) => {
        this.pendingRequests = response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending account requests:', error);
        this.error = 'Failed to load pending account requests';
        this.loading = false;
      }
    });
  }

  approveRequest(requestId: number) {
    this.accountService.approveAccountRequest(requestId).subscribe({
      next: (response) => {
        console.log('Account request approved:', response);
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error approving account request:', error);
        this.error = 'Failed to approve account request';
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

    this.accountService.rejectAccountRequest(this.selectedRequestId, this.denyReason).subscribe({
      next: (response) => {
        console.log('Account request denied:', response);
        this.closeDenyModal();
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error denying account request:', error);
        this.error = 'Failed to deny account request';
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

    this.accountService.rejectAccountRequest(requestId, reason).subscribe({
      next: (response) => {
        console.log('Account request denied:', response);
        this.loadPendingRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error denying account request:', error);
        this.error = 'Failed to deny account request';
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
} 