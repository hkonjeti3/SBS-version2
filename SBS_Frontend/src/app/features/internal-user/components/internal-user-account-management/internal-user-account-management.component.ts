import { Component, OnInit } from '@angular/core';
import { AccountService, AccountRequest } from '../../../../core/services/account.service';

@Component({
  selector: 'app-internal-user-account-management',
  templateUrl: './internal-user-account-management.component.html',
  styleUrls: ['./internal-accounts.component.css']
})
export class InternalUserAccountManagementComponent implements OnInit {
  pendingAccountRequests: AccountRequest[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    console.log('InternalAccountsComponent initialized');
    this.loadPendingAccountRequests();
  }

  private loadPendingAccountRequests(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Loading pending account requests...');
    console.log('API URL:', `${this.accountService['baseUrl']}/approval/pending`);

    this.accountService.getPendingAccountRequests().subscribe({
      next: (requests) => {
        console.log('Account requests response:', requests);
        this.pendingAccountRequests = requests;
        this.isLoading = false;
        console.log('Pending account requests loaded:', requests);
      },
      error: (error) => {
        console.error('Error loading pending account requests:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.isLoading = false;
        this.errorMessage = 'Failed to load account requests. Please try again.';
      }
    });
  }

  approveAccountRequest(requestId: number): void {
    console.log('Approving account request:', requestId);
    
    this.accountService.approveAccountRequest(requestId).subscribe({
      next: (response) => {
        console.log('Account request approved:', response);
        alert('Account request approved successfully!');
        this.loadPendingAccountRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error approving account request:', error);
        alert('Failed to approve account request. Please try again.');
      }
    });
  }

  rejectAccountRequest(requestId: number): void {
    console.log('Rejecting account request:', requestId);
    
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    this.accountService.rejectAccountRequest(requestId, reason || undefined).subscribe({
      next: (response) => {
        console.log('Account request rejected:', response);
        alert('Account request rejected successfully!');
        this.loadPendingAccountRequests(); // Reload the list
      },
      error: (error) => {
        console.error('Error rejecting account request:', error);
        alert('Failed to reject account request. Please try again.');
      }
    });
  }

  getAccountTypeDisplay(type: string): string {
    const typeMap: { [key: string]: string } = {
      'savings': 'Savings Account',
      'checking': 'Checking Account',
      'credit': 'Credit Account',
      'investment': 'Investment Account'
    };
    return typeMap[type] || type;
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

  retryLoadRequests(): void {
    this.loadPendingAccountRequests();
  }
} 