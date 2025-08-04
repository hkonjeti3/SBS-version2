import { Component, OnInit } from '@angular/core';
import { AccountService, AccountRequest } from '../../../../core/services/account.service';
import { decodeToken } from '../../../../core/utils/jwt-helper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css']
})
export class CustomerAccountComponent implements OnInit {
  accounts: any[] = [];
  accountSummary: any = {};
  loading: boolean = false;
  errorMessage: string = '';

  // Account creation request properties
  showCreateModal: boolean = false;
  isCreating: boolean = false;
  createAccountForm!: FormGroup;

  // User's account requests
  userAccountRequests: AccountRequest[] = [];
  loadingRequests: boolean = false;

  // Pagination properties
  pendingRequests: AccountRequest[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages: number = 0;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.initCreateAccountForm();
  }

  private initCreateAccountForm(): void {
    this.createAccountForm = this.formBuilder.group({
      accountType: ['', Validators.required],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      reason: ['', Validators.required]
    });
  }

  private loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';

    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        this.accountService.getUserAccounts(decodedToken.userId).subscribe({
          next: (accounts) => {
            this.accounts = accounts;
            this.calculateSummary();
            this.loading = false;
            console.log('Accounts loaded:', accounts);
          },
          error: (error) => {
            console.error('Error loading accounts:', error);
            this.loading = false;
            this.errorMessage = 'Failed to load accounts. Please try again.';
          }
        });

        // Load user's account requests
        this.loadUserAccountRequests();
      }
    }
  }

  private loadUserAccountRequests(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken?.userId) {
        this.loadingRequests = true;
        this.accountService.getUserAccountRequests(decodedToken.userId).subscribe({
          next: (requests) => {
            this.userAccountRequests = requests;
            // Filter only pending requests
            this.pendingRequests = requests.filter(request => request.status === 'Pending');
            this.calculatePagination();
            this.loadingRequests = false;
            console.log('User account requests loaded:', requests);
            console.log('Pending requests:', this.pendingRequests);
          },
          error: (error) => {
            console.error('Error loading account requests:', error);
            this.loadingRequests = false;
          }
        });
      }
    }
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.pendingRequests.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when data changes
  }

  get paginatedPendingRequests(): AccountRequest[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.pendingRequests.slice(startIndex, endIndex);
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Make Math available in template
  get Math() {
    return Math;
  }

  private calculateSummary(): void {
    const totalBalance = this.accounts.reduce((sum, account) => {
      // Convert balance to number, handling both string and number types
      let balance = 0;
      if (account.balance) {
        if (typeof account.balance === 'string') {
          balance = parseFloat(account.balance) || 0;
        } else {
          balance = Number(account.balance) || 0;
        }
      }
      return sum + balance;
    }, 0);

    this.accountSummary = {
      totalAccounts: this.accounts.length,
      totalBalance: totalBalance,
      activeAccounts: this.accounts.filter(account => account.status === 'Active').length
    };
  }

  openCreateAccountModal(): void {
    this.showCreateModal = true;
    this.createAccountForm.reset();
  }

  closeCreateAccountModal(): void {
    this.showCreateModal = false;
    this.createAccountForm.reset();
  }

  createAccount(): void {
    if (this.createAccountForm.valid) {
      this.isCreating = true;
      
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken?.userId) {
          const formValue = this.createAccountForm.value;
          const request: AccountRequest = {
            userId: decodedToken.userId,
            accountType: formValue.accountType,
            initialBalance: formValue.initialBalance,
            reason: formValue.reason,
            status: 'Pending'
          };

          this.accountService.submitAccountRequest(request).subscribe({
            next: (response) => {
              console.log('Account creation request submitted:', response);
              this.isCreating = false;
              this.closeCreateAccountModal();
              this.loadUserAccountRequests(); // Reload requests
              alert('Account creation request submitted successfully! It will be reviewed by an administrator.');
            },
            error: (error) => {
              console.error('Error submitting account creation request:', error);
              this.isCreating = false;
              alert('Failed to submit account creation request. Please try again.');
            }
          });
        }
      }
    }
  }

  refreshAccounts(): void {
    this.loadAccounts();
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

  getAccountTypeDisplay(type: string): string {
    if (!type) return 'Unknown';
    
    // Handle different formats
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('savings')) {
      return 'Savings Account';
    } else if (typeLower.includes('checking')) {
      return 'Checking Account';
    } else if (typeLower.includes('credit')) {
      return 'Credit Account';
    } else if (typeLower.includes('loan')) {
      return 'Loan Account';
    } else {
      // Return the original type with proper capitalization
      return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    }
  }

  parseBalance(balance: any): number {
    if (!balance) return 0;
    if (typeof balance === 'string') {
      return parseFloat(balance) || 0;
    }
    return Number(balance) || 0;
  }
}
  
