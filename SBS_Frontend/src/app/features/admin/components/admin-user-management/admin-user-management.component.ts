import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { AccountService } from '../../../../core/services/account.service';
import { ProfileRequestService } from '../../../../core/services/profile-request.service';
import { ActivityService } from '../../../../core/services/activity.service';
import { user } from '../../../../core/services/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css']
})
export class AdminUserManagementComponent implements OnInit {
  // Math object for template use
  Math = Math;
  
  users: user[] = [];
  filteredUsers: user[] = [];
  displayedUsers: user[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  searchTerm: string = '';
  statusFilter: string = '';
  roleFilter: string = '';
  isUpdatingStatus: { [key: number | string]: boolean } = {};

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // Modal state
  showUserModal: boolean = false;
  selectedUser: user | null = null;

  // Statistics
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;

  // Available roles for filtering
  availableRoles: string[] = [];

  // User selection and bulk actions
  selectedUsers: user[] = [];
  openDropdown: number | null = null;

  // Approval requests
  pendingAccountRequests: any[] = [];
  pendingProfileRequests: any[] = [];
  isLoadingApprovals: boolean = false;
  isProcessingRequest: { [key: number]: boolean } = {};

  constructor(
    private adminService: AdminService,
    private accountService: AccountService,
    private profileRequestService: ProfileRequestService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.loadApprovalRequests();
    
    // Add click outside handler to close dropdown
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        this.openDropdown = null;
      }
    });
  }

  // Pagination methods
  public getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedUsers();
    }
  }

  public goToFirstPage(): void {
    this.goToPage(1);
  }

  public goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  public goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  public goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // User action methods
  public editUser(user: user): void {
    // TODO: Implement edit user functionality
    console.log('Edit user:', user);
  }

  public activateUser(user: user): void {
    this.toggleUserStatus(user);
  }

  public deactivateUser(user: user): void {
    this.toggleUserStatus(user);
  }

  // Helper methods for styling
  public getRoleClass(role: any): string {
    if (!role) return '';
    
    // Handle both string and object role formats
    const roleName = typeof role === 'string' ? role : role.roleName;
    
    if (!roleName) return '';
    
    return roleName.toLowerCase().replace(/\s+/g, '');
  }

  public getStatusClass(status: string | null | undefined): string {
    if (!status) return '';
    return status.toLowerCase();
  }

  // Filter methods
  public clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.roleFilter = '';
    this.filterUsers();
  }

  public hasActiveFilters(): boolean {
    return this.searchTerm !== '' || this.statusFilter !== '' || this.roleFilter !== '';
  }

  private updateDisplayedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
    this.totalItems = this.filteredUsers.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    
    // Reset current page if it's out of bounds
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  // User selection methods
  public toggleUserSelection(user: user): void {
    const index = this.selectedUsers.findIndex(u => u.userId === user.userId);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  public isUserSelected(user: user): boolean {
    return this.selectedUsers.some(u => u.userId === user.userId);
  }

  public toggleSelectAll(): void {
    if (this.isAllSelected()) {
      this.selectedUsers = [];
    } else {
      this.selectedUsers = [...this.displayedUsers];
    }
  }

  public isAllSelected(): boolean {
    return this.displayedUsers.length > 0 && this.selectedUsers.length === this.displayedUsers.length;
  }

  // Bulk actions
  public bulkActivate(): void {
    const inactiveUsers = this.selectedUsers.filter(user => user.status === 'Inactive');
    inactiveUsers.forEach(user => this.toggleUserStatus(user));
  }

  public bulkDeactivate(): void {
    const activeUsers = this.selectedUsers.filter(user => user.status === 'Active');
    activeUsers.forEach(user => this.toggleUserStatus(user));
  }

  public hasInactiveSelected(): boolean {
    return this.selectedUsers.some(user => user.status === 'Inactive');
  }

  public hasActiveSelected(): boolean {
    return this.selectedUsers.some(user => user.status === 'Active');
  }

  // Dropdown management
  public toggleUserDropdown(userId: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (this.openDropdown === userId) {
      this.openDropdown = null;
    } else {
      this.openDropdown = userId;
    }
  }

  // User initials for avatar
  public getUserInitials(user: user): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  public getUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.adminService.getAllUsers().subscribe({
      next: (response: any) => {
        console.log('Admin users response:', response);
        
        // Handle different response formats
        if (response && response.users) {
          // New format with wrapped object
          this.users = response.users;
        } else if (Array.isArray(response)) {
          // Direct array format
          this.users = response;
        } else {
          console.error('Invalid response format:', response);
          this.errorMessage = 'Invalid response format from server';
          this.isLoading = false;
          return;
        }
        
        this.filteredUsers = [...this.users];
        this.currentPage = 1; // Reset to first page
        this.updateDisplayedUsers();
        this.calculateStatistics();
        this.extractAvailableRoles();
        this.isLoading = false;
        console.log('Users retrieved:', this.users);
        console.log('Available roles:', this.availableRoles);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('There was an error retrieving users:', error);
        this.errorMessage = error.message || 'Failed to load users. Please try again.';
      }
    });
  }

  public retryLoadUsers(): void {
    this.getUsers();
  }

  public refreshUsers(): void {
    this.getUsers();
  }

  public filterUsers(): void {
    console.log('Filtering users with:', {
      searchTerm: this.searchTerm,
      statusFilter: this.statusFilter,
      roleFilter: this.roleFilter
    });

    this.filteredUsers = this.users.filter(user => {
      // Search term filter
      const searchMatch = !this.searchTerm || 
        (user.firstName && user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (user.emailAddress && user.emailAddress.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Status filter
      const statusMatch = !this.statusFilter || user.status === this.statusFilter;

      // Role filter
      const roleMatch = !this.roleFilter || 
        (user.role && user.role.roleName === this.roleFilter);

      return searchMatch && statusMatch && roleMatch;
    });

    console.log('Filtered users:', this.filteredUsers);
    
    // Reset to first page when filtering
    this.currentPage = 1;
    this.updateDisplayedUsers();
  }

  public toggleUserStatus(user: user): void {
    if (!user.userId) {
      console.error('Cannot toggle status: user ID is missing');
      return;
    }

    const userId = user.userId;
    this.isUpdatingStatus[userId] = true;

    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    console.log(`Toggling user ${userId} status from ${user.status} to ${newStatus}`);

    this.adminService.updateUserStatus(userId, newStatus).subscribe({
      next: (response: any) => {
        console.log('Status update response:', response);
        
        // Update the user's status in the local array
        const userIndex = this.users.findIndex(u => u.userId === userId);
        if (userIndex > -1) {
          this.users[userIndex].status = newStatus;
        }
        
        // Update filtered users as well
        const filteredIndex = this.filteredUsers.findIndex(u => u.userId === userId);
        if (filteredIndex > -1) {
          this.filteredUsers[filteredIndex].status = newStatus;
        }

        // Update displayed users
        const displayedIndex = this.displayedUsers.findIndex(u => u.userId === userId);
        if (displayedIndex > -1) {
          this.displayedUsers[displayedIndex].status = newStatus;
        }

        // Remove from selected users if status changed
        this.selectedUsers = this.selectedUsers.filter(u => u.userId !== userId);
        
        this.calculateStatistics();
        this.isUpdatingStatus[userId] = false;
        
        // Show success message
        this.successMessage = `User status successfully updated to ${newStatus}`;
        this.errorMessage = '';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        
        console.log(`User ${userId} status updated to ${newStatus}`);
      },
      error: (error: any) => {
        console.error('Error updating user status:', error);
        this.isUpdatingStatus[userId] = false;
        
        // Show error message
        this.errorMessage = error.message || 'Failed to update user status';
        this.successMessage = '';
        
        // Clear error message after 5 seconds
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  public viewUserDetails(user: user): void {
    this.selectedUser = user;
    this.showUserModal = true;
    this.openDropdown = null; // Close dropdown when opening modal
  }

  public closeDropdown(): void {
    this.openDropdown = null;
  }

  private dropdownLeaveTimeout: any = null;

  public onDropdownContainerEnter(): void {
    // Clear any pending close timeout when mouse enters
    if (this.dropdownLeaveTimeout) {
      clearTimeout(this.dropdownLeaveTimeout);
      this.dropdownLeaveTimeout = null;
    }
  }

  public onDropdownContainerLeave(): void {
    // Close dropdown when mouse leaves container with a longer delay
    this.dropdownLeaveTimeout = setTimeout(() => {
      this.openDropdown = null;
      this.dropdownLeaveTimeout = null;
    }, 300);
  }

  public onDropdownMenuEnter(): void {
    // Clear any pending close timeout when mouse enters dropdown menu
    if (this.dropdownLeaveTimeout) {
      clearTimeout(this.dropdownLeaveTimeout);
      this.dropdownLeaveTimeout = null;
    }
  }

  public onDropdownMenuLeave(): void {
    // Close dropdown when mouse leaves dropdown menu
    this.dropdownLeaveTimeout = setTimeout(() => {
      this.openDropdown = null;
      this.dropdownLeaveTimeout = null;
    }, 200);
  }

  public closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  // Account Management
  public showAccountModal: boolean = false;
  public userAccounts: any[] = [];
  public isLoadingAccounts: boolean = false;
  public isUpdatingAccountStatus: { [key: number]: boolean } = {};

  public manageUserAccounts(user: user): void {
    this.selectedUser = user;
    this.showAccountModal = true;
    this.loadUserAccounts(user.userId || 0);
  }

  public closeAccountModal(): void {
    this.showAccountModal = false;
    this.selectedUser = null;
    this.userAccounts = [];
  }

  public loadUserAccounts(userId: number): void {
    this.isLoadingAccounts = true;
    this.userAccounts = [];

    this.accountService.getUserAccounts(userId).subscribe({
      next: (accounts: any[]) => {
        this.userAccounts = accounts;
        this.isLoadingAccounts = false;
        console.log('User accounts loaded:', accounts);
      },
      error: (error: any) => {
        console.error('Error loading user accounts:', error);
        this.isLoadingAccounts = false;
        this.userAccounts = [];
      }
    });
  }

  public updateAccountStatus(accountId: number, newStatus: string): void {
    this.isUpdatingAccountStatus[accountId] = true;

    this.accountService.updateAccountStatus(accountId, newStatus).subscribe({
      next: (response: any) => {
        console.log('Account status updated successfully:', response);
        
        // Update the account status in the local array
        const accountIndex = this.userAccounts.findIndex(acc => acc.accountId === accountId);
        if (accountIndex !== -1) {
          this.userAccounts[accountIndex].status = newStatus;
        }
        
        this.isUpdatingAccountStatus[accountId] = false;
        
        // Log admin activity
        const action = newStatus === 'Active' ? 'Account Activated' : 'Account Deactivated';
        const description = `Account #${this.userAccounts[accountIndex]?.accountNumber || accountId} ${newStatus.toLowerCase()}d by admin`;
        
        this.activityService.logActivity(
          this.selectedUser?.userId || 0,
          action,
          description,
          `Account status changed to ${newStatus}`
        ).subscribe({
          next: () => console.log('Admin activity logged successfully'),
          error: (error) => console.error('Failed to log admin activity:', error)
        });
        
        // Show success message
        this.successMessage = `Account status updated to ${newStatus}`;
        setTimeout(() => { this.successMessage = ''; }, 3000);
      },
      error: (error: any) => {
        console.error('Error updating account status:', error);
        this.isUpdatingAccountStatus[accountId] = false;
        
        // Show error message
        this.errorMessage = error.message || 'Failed to update account status';
        setTimeout(() => { this.errorMessage = ''; }, 5000);
      }
    });
  }

  public getAccountBalance(balance: any): string {
    if (balance === null || balance === undefined) {
      return '0.00';
    }
    
    // Convert to number if it's a string
    const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance;
    
    // Check if it's a valid number
    if (isNaN(numBalance)) {
      return '0.00';
    }
    
    // Format to 2 decimal places
    return numBalance.toFixed(2);
  }

  public isAccountActive(status: string): boolean {
    if (!status) return false;
    return status.toLowerCase() === 'active';
  }

  public getAccountStatusClass(status: string): string {
    return status?.toLowerCase() === 'active' ? 'active' : 'inactive';
  }

  private calculateStatistics(): void {
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(user => user.status === 'Active').length;
    this.inactiveUsers = this.users.filter(user => user.status === 'Inactive').length;
  }

  private extractAvailableRoles(): void {
    const roles = new Set<string>();
    this.users.forEach(user => {
      if (user.role && user.role.roleName) {
        roles.add(user.role.roleName);
      }
    });
    this.availableRoles = Array.from(roles).sort();
  }

  public loadApprovalRequests(): void {
    this.isLoadingApprovals = true;
    
    // Load account requests
    this.accountService.getPendingAccountRequests().subscribe({
      next: (requests: any) => {
        this.pendingAccountRequests = requests || [];
        console.log('Pending account requests:', this.pendingAccountRequests);
      },
      error: (error: any) => {
        console.error('Error loading account requests:', error);
        this.pendingAccountRequests = [];
      }
    });

    // Load profile requests
    this.profileRequestService.getPendingProfileRequests().subscribe({
      next: (requests: any) => {
        this.pendingProfileRequests = requests || [];
        console.log('Pending profile requests:', this.pendingProfileRequests);
        this.isLoadingApprovals = false;
      },
      error: (error: any) => {
        console.error('Error loading profile requests:', error);
        this.pendingProfileRequests = [];
        this.isLoadingApprovals = false;
      }
    });
  }

  public approveAccountRequest(request: any): void {
    if (!request.id) {
      console.error('Cannot approve: request ID is missing');
      return;
    }

    this.isProcessingRequest[request.id] = true;
    console.log('Approving account request:', request);

    this.accountService.approveAccountRequest(request.id).subscribe({
      next: (response: any) => {
        console.log('Account request approved:', response);
        this.pendingAccountRequests = this.pendingAccountRequests.filter(r => r.id !== request.id);
        this.isProcessingRequest[request.id] = false;
      },
      error: (error: any) => {
        console.error('Error approving account request:', error);
        this.isProcessingRequest[request.id] = false;
      }
    });
  }

  public rejectAccountRequest(request: any): void {
    if (!request.id) {
      console.error('Cannot reject: request ID is missing');
      return;
    }

    this.isProcessingRequest[request.id] = true;
    console.log('Rejecting account request:', request);

    this.accountService.rejectAccountRequest(request.id).subscribe({
      next: (response: any) => {
        console.log('Account request rejected:', response);
        this.pendingAccountRequests = this.pendingAccountRequests.filter(r => r.id !== request.id);
        this.isProcessingRequest[request.id] = false;
      },
      error: (error: any) => {
        console.error('Error rejecting account request:', error);
        this.isProcessingRequest[request.id] = false;
      }
    });
  }

  public approveProfileRequest(request: any): void {
    if (!request.id) {
      console.error('Cannot approve: request ID is missing');
      return;
    }

    this.isProcessingRequest[request.id] = true;
    console.log('Approving profile request:', request);

    this.profileRequestService.approveProfileRequest(request.id).subscribe({
      next: (response: any) => {
        console.log('Profile request approved:', response);
        this.pendingProfileRequests = this.pendingProfileRequests.filter(r => r.id !== request.id);
        this.isProcessingRequest[request.id] = false;
      },
      error: (error: any) => {
        console.error('Error approving profile request:', error);
        this.isProcessingRequest[request.id] = false;
      }
    });
  }

  public rejectProfileRequest(request: any): void {
    if (!request.id) {
      console.error('Cannot reject: request ID is missing');
      return;
    }

    this.isProcessingRequest[request.id] = true;
    console.log('Rejecting profile request:', request);

    this.profileRequestService.rejectProfileRequest(request.id).subscribe({
      next: (response: any) => {
        console.log('Profile request rejected:', response);
        this.pendingProfileRequests = this.pendingProfileRequests.filter(r => r.id !== request.id);
        this.isProcessingRequest[request.id] = false;
      },
      error: (error: any) => {
        console.error('Error rejecting profile request:', error);
        this.isProcessingRequest[request.id] = false;
      }
    });
  }
}
