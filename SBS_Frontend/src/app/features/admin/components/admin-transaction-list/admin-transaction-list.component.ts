import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../../../core/services/transaction.service';

@Component({
  selector: 'app-admin-transaction-list',
  templateUrl: './admin-transaction-list.component.html',
  styleUrls: ['./admin-transaction-list.component.css']
})
export class AdminTransactionListComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  searchTerm: string = '';
  statusFilter: string = '';
  typeFilter: string = '';
  senderFilter: string = '';
  receiverFilter: string = '';
  dateFilter: string = '';
  isProcessing: { [key: number]: boolean } = {};

  // Statistics
  totalTransactions: number = 0;
  pendingTransactions: number = 0;
  completedTransactions: number = 0;
  totalAmount: number = 0;

  // Unique account lists for filters
  uniqueSenderAccounts: string[] = [];
  uniqueReceiverAccounts: string[] = [];

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;
  displayedTransactions: any[] = [];

  // Dropdown state
  openDropdown: number | null = null;

  // Math object for template use
  Math = Math;

  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) { }

  ngOnInit(): void {
    this.loadTransactions();
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
      this.updateDisplayedTransactions();
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

  // Helper methods for styling
  public getTypeClass(transactionType: string): string {
    if (!transactionType) return '';
    return transactionType.toLowerCase().replace(/\s+/g, '_');
  }

  public getStatusClass(status: string): string {
    if (!status) return '';
    return status.toLowerCase();
  }

  private updateDisplayedTransactions(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
    this.totalItems = this.filteredTransactions.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    
    // Reset current page if it's out of bounds
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  // Dropdown methods
  public toggleTransactionDropdown(transactionId: number): void {
    this.openDropdown = this.openDropdown === transactionId ? null : transactionId;
  }

  // Amount display methods
  public getAmountDisplay(transaction: any): string {
    const amount = transaction.amount || 0;
    return `$${Math.abs(amount).toFixed(2)}`;
  }

  public getAmountClass(transaction: any): string {
    const amount = transaction.amount || 0;
    return amount >= 0 ? 'positive' : 'negative';
  }

  public getTransactionId(transaction: any): string {
    if (!transaction) return 'N/A';
    
    // Try different possible field names for transaction ID
    const id = transaction.id || transaction.transactionId || transaction.transaction_id || transaction.transactionId || transaction.transaction_id;
    
    if (id && id !== 'N/A') {
      return id.toString();
    }
    
    // If no ID found, try to create one from other fields
    if (transaction.senderAccountNumber && transaction.receiverAccountNumber) {
      return `${transaction.senderAccountNumber.slice(-8)}-${transaction.receiverAccountNumber.slice(-8)}`;
    }
    
    return 'N/A';
  }

  public getTransactionDate(transaction: any): string {
    if (!transaction) return 'N/A';
    // Try different possible field names for date
    const date = transaction.createdDate || transaction.created_date || transaction.createdtime || transaction.created_time || transaction.date || transaction.createdAt;
    if (!date) return 'N/A';
    
    try {
      return new Date(date).toLocaleString();
    } catch (error) {
      return 'N/A';
    }
  }

  public getRawTransactionDate(transaction: any): Date | null {
    if (!transaction) return null;
    // Try different possible field names for date
    const date = transaction.createdDate || transaction.created_date || transaction.createdtime || transaction.created_time || transaction.date || transaction.createdAt;
    if (!date) return null;
    
    try {
      return new Date(date);
    } catch (error) {
      return null;
    }
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // For now, we'll load all transactions. In a real app, you might want to paginate
    this.transactionService.getAllTransactions().subscribe({
      next: (response: any) => {
        this.transactions = response || [];
        // Sort transactions by last updated time in descending order
        this.transactions.sort((a, b) => {
          const dateA = this.getRawTransactionDate(a);
          const dateB = this.getRawTransactionDate(b);
          
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          
          return dateB.getTime() - dateA.getTime();
        });
        
        this.filteredTransactions = [...this.transactions];
        this.calculateStatistics();
        this.populateFilterOptions();
        this.updateDisplayedTransactions(); // Initialize pagination
        this.isLoading = false;
        console.log('Transactions loaded:', this.transactions);
        if (this.transactions.length > 0) {
          console.log('Sample transaction structure:', this.transactions[0]);
          console.log('Sample transaction ID:', this.getTransactionId(this.transactions[0]));
          console.log('Sample transaction date:', this.getTransactionDate(this.transactions[0]));
        }
        
        // Show user-friendly message if no transactions
        if (this.transactions.length === 0) {
          this.errorMessage = 'No transactions found. The system is ready to process new transactions.';
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error loading transactions:', error);
        
        // Provide more specific error messages
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status === 401) {
          this.errorMessage = 'Authentication required. Please log in again.';
        } else if (error.status === 403) {
          this.errorMessage = 'Access denied. You do not have permission to view transactions.';
        } else if (error.status === 404) {
          this.errorMessage = 'Transaction service not found. Please contact support.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = error.message || 'Failed to load transactions. Please try again.';
        }
      }
    });
  }

  retryLoadTransactions(): void {
    this.loadTransactions();
  }

  refreshTransactions(): void {
    this.loadTransactions();
  }

  populateFilterOptions(): void {
    // Extract unique sender accounts
    this.uniqueSenderAccounts = [...new Set(
      this.transactions
        .map(t => t.senderAcc?.accountNumber)
        .filter(account => account && account !== 'N/A')
    )].sort();

    // Extract unique receiver accounts
    this.uniqueReceiverAccounts = [...new Set(
      this.transactions
        .map(t => t.receiverAcc?.accountNumber)
        .filter(account => account && account !== 'N/A')
    )].sort();
  }

  filterTransactions(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const transactionId = this.getTransactionId(transaction);
      const matchesSearch = !this.searchTerm || 
        transactionId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.senderAccountNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.receiverAccountNumber?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.transactionType?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.amount?.toString().includes(this.searchTerm);
      
      const matchesStatus = !this.statusFilter || transaction.status === this.statusFilter;
      const matchesType = !this.typeFilter || transaction.transactionType === this.typeFilter;
      const matchesSender = !this.senderFilter || 
        transaction.senderAccountNumber?.toLowerCase().includes(this.senderFilter.toLowerCase());
      const matchesReceiver = !this.receiverFilter || 
        transaction.receiverAccountNumber?.toLowerCase().includes(this.receiverFilter.toLowerCase());
      const matchesDate = !this.dateFilter || this.matchesDateFilter(transaction.createdDate, this.dateFilter);
      
      return matchesSearch && matchesStatus && matchesType && matchesSender && matchesReceiver && matchesDate;
    });
    
    // Reset to first page and update displayed transactions
    this.currentPage = 1;
    this.updateDisplayedTransactions();
  }

  matchesDateFilter(transactionDate: string, filter: string): boolean {
    if (!transactionDate) return false;
    
    const date = new Date(transactionDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    switch (filter) {
      case 'today':
        return date >= today;
      case 'week':
        return date >= weekStart;
      case 'month':
        return date >= monthStart;
      case 'year':
        return date >= yearStart;
      default:
        return true;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.typeFilter = '';
    this.senderFilter = '';
    this.receiverFilter = '';
    this.dateFilter = '';
    this.filterTransactions();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm || this.statusFilter || this.typeFilter || 
             this.senderFilter || this.receiverFilter || this.dateFilter);
  }

  getStatusIcon(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'pi-clock';
      case 'APPROVED':
        return 'pi-check-circle';
      case 'REJECTED':
        return 'pi-times-circle';
      case 'COMPLETED':
        return 'pi-check';
      case 'INACTIVE':
        return 'pi-ban';
      default:
        return 'pi-circle';
    }
  }

  approveTransaction(transaction: any): void {
    if (this.isProcessing[transaction.transactionId]) return;

    this.isProcessing[transaction.transactionId] = true;

    this.transactionService.approveTransaction(transaction.transactionId).subscribe({
      next: (response: any) => {
        transaction.status = 'APPROVED';
        this.calculateStatistics();
        this.isProcessing[transaction.transactionId] = false;
        console.log(`Transaction ${transaction.transactionId} approved`);
      },
      error: (error: any) => {
        this.isProcessing[transaction.transactionId] = false;
        console.error('Error approving transaction:', error);
        alert(`Failed to approve transaction: ${error.message || 'Unknown error'}`);
      }
    });
  }

  rejectTransaction(transaction: any): void {
    if (this.isProcessing[transaction.transactionId]) return;

    this.isProcessing[transaction.transactionId] = true;

    this.transactionService.rejectTransaction(transaction.transactionId).subscribe({
      next: (response: any) => {
        transaction.status = 'REJECTED';
        this.calculateStatistics();
        this.isProcessing[transaction.transactionId] = false;
        console.log(`Transaction ${transaction.transactionId} rejected`);
      },
      error: (error: any) => {
        this.isProcessing[transaction.transactionId] = false;
        console.error('Error rejecting transaction:', error);
        alert(`Failed to reject transaction: ${error.message || 'Unknown error'}`);
      }
    });
  }

  isProcessingTransaction(transactionId: number): boolean {
    return this.isProcessing[transactionId] || false;
  }

  viewTransactionDetails(transaction: any): void {
    console.log('Viewing transaction details:', transaction);
    // TODO: Implement transaction details view or modal
  }

  private calculateStatistics(): void {
    this.totalTransactions = this.transactions.length;
    this.pendingTransactions = this.transactions.filter(t => t.status === 'PENDING').length;
    this.completedTransactions = this.transactions.filter(t => t.status === 'COMPLETED').length;
    this.totalAmount = this.transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  }
}
