import { Component, OnInit } from '@angular/core';
import { decodeToken } from '../../../../core/utils/jwt-helper';
import { TransactionService } from '../../../../core/services/transaction.service';
import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-customer-transaction-history',
  templateUrl: './customer-transaction-history.component.html',
  styleUrl: './customer-transaction-history.component.css'
})
export class CustomerTransactionHistoryComponent implements OnInit {
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  userAccounts: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Filter properties
  selectedStatus: string = '';
  selectedType: string = '';
  selectedSenderAccount: string = '';
  selectedReceiverAccount: string = '';
  selectedDateRange: string = '';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  paginatedTransactions: any[] = [];

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.loadUserAccounts();
    this.loadTransactions();
  }

  loadUserAccounts() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        this.accountService.getUserAccounts(decodedToken.userId)
          .subscribe({
            next: (data: any[]) => {
              this.userAccounts = data;
            },
            error: (error) => {
              console.error('Error loading user accounts:', error);
              this.userAccounts = [];
            }
          });
      }
    }
  }

  loadTransactions() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.userId) {
        this.isLoading = true;
        this.errorMessage = '';
        
        this.transactionService.getTransactionHistory(decodedToken.userId)
          .subscribe({
            next: (data: any[]) => {
              console.log('=== Received transaction data from backend ===');
              console.log('Total transactions:', data.length);
              data.forEach((transaction, index) => {
                console.log(`Transaction ${index + 1}:`, {
                  id: transaction.transactionId,
                  type: transaction.transactionType,
                  senderAccount: transaction.senderAccountNumber,
                  receiverAccount: transaction.receiverAccountNumber,
                  amount: transaction.amount,
                  status: transaction.status,
                  description: transaction.description
                });
              });
              
              this.transactions = data;
              this.filteredTransactions = [...this.transactions];
              this.updatePagination();
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error loading transactions:', error);
              this.isLoading = false;
              this.errorMessage = 'Failed to load transactions. Please try again.';
              this.transactions = [];
              this.filteredTransactions = [];
              this.updatePagination();
            }
          });
      }
    }
  }

  applyFilters() {
    this.filteredTransactions = this.transactions.filter(transaction => {
      // Status filter
      if (this.selectedStatus && transaction.status?.toLowerCase() !== this.selectedStatus.toLowerCase()) {
        return false;
      }

      // Type filter
      if (this.selectedType && transaction.type?.toLowerCase() !== this.selectedType.toLowerCase()) {
        return false;
      }

      // Account filter - check both sender and receiver accounts
      if (this.selectedSenderAccount || this.selectedReceiverAccount) {
        const senderAccount = transaction.senderAccountNumber || (transaction.senderAcc?.accountNumber);
        const receiverAccount = transaction.receiverAccountNumber || (transaction.receiverAcc?.accountNumber);
        
        if (this.selectedSenderAccount && senderAccount !== this.selectedSenderAccount) {
          return false;
        }
        if (this.selectedReceiverAccount && receiverAccount !== this.selectedReceiverAccount) {
          return false;
        }
      }

      // Date range filter
      if (this.selectedDateRange) {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        
        switch (this.selectedDateRange) {
          case 'today':
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (transactionDate < today) return false;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (transactionDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            if (transactionDate < monthAgo) return false;
            break;
          case 'quarter':
            const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
            if (transactionDate < quarterAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            if (transactionDate < yearAgo) return false;
            break;
        }
      }

      return true;
    });
    
    this.currentPage = 1; // Reset to first page when filters change
    this.updatePagination();
  }

  clearFilters() {
    this.selectedStatus = '';
    this.selectedType = '';
    this.selectedSenderAccount = '';
    this.selectedReceiverAccount = '';
    this.selectedDateRange = '';
    this.filteredTransactions = [...this.transactions];
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  get hasActiveFilters(): boolean {
    return !!(this.selectedStatus || this.selectedType || this.selectedSenderAccount || this.selectedReceiverAccount || this.selectedDateRange);
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'pending':
        return 'pending';
      case 'failed':
        return 'failed';
      case 'processing':
        return 'processing';
      case 'rejected':
        return 'rejected';
      case 'approved':
        return 'approved';
      default:
        return 'completed';
    }
  }

  getTypeClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'credit':
        return 'credit';
      case 'debit':
        return 'debit';
      case 'transfer':
        return 'transfer';
      case 'deposit':
        return 'deposit';
      case 'withdrawal':
        return 'withdrawal';
      default:
        return 'transfer';
    }
  }

  getAccountTypeDisplay(accountType: string): string {
    if (!accountType) return 'N/A';
    
    switch (accountType.toLowerCase()) {
      case 'savings':
        return 'Savings Account';
      case 'checking':
        return 'Checking Account';
      case 'current':
        return 'Current Account';
      case 'credit':
        return 'Credit Account';
      default:
        return accountType.charAt(0).toUpperCase() + accountType.slice(1) + ' Account';
    }
  }

  getSenderAccountInfo(transaction: any): any {
    const senderAccount = transaction.senderAccountNumber || (transaction.senderAcc?.accountNumber);
    
    if (senderAccount) {
      const account = this.userAccounts.find(acc => acc.accountNumber === senderAccount);
      return {
        accountType: this.getAccountTypeDisplay(account?.accountType || 'Unknown'),
        accountNumber: senderAccount
      };
    }
    
    return null;
  }

  getReceiverAccountInfo(transaction: any): any {
    const receiverAccount = transaction.receiverAccountNumber || (transaction.receiverAcc?.accountNumber);
    
    if (receiverAccount) {
      const account = this.userAccounts.find(acc => acc.accountNumber === receiverAccount);
      return {
        accountType: this.getAccountTypeDisplay(account?.accountType || 'Unknown'),
        accountNumber: receiverAccount
      };
    }
    
    return null;
  }

  getAccountInfo(transaction: any): any {
    // Get the current user's ID from JWT token
    const token = localStorage.getItem('jwtToken');
    const decodedToken = token ? decodeToken(token) : null;
    const currentUserId = decodedToken?.userId;
    
    // Try to get account info from various possible fields
    const senderAccount = transaction.senderAccountNumber || (transaction.senderAcc?.accountNumber);
    const receiverAccount = transaction.receiverAccountNumber || (transaction.receiverAcc?.accountNumber);
    
    // Determine if current user is sender or receiver
    const isSender = transaction.senderAcc?.user?.userId === currentUserId || 
                    (transaction.user?.userId === currentUserId && senderAccount);
    const isReceiver = transaction.receiverAcc?.user?.userId === currentUserId || 
                      (!isSender && receiverAccount);
    
    // Find account details from user's accounts
    let accountNumber = '';
    let accountType = '';
    let role = '';
    
    if (isSender) {
      accountNumber = senderAccount;
      role = 'From';
      const account = this.userAccounts.find(acc => acc.accountNumber === senderAccount);
      accountType = account?.accountType || 'Unknown';
    } else if (isReceiver) {
      accountNumber = receiverAccount;
      role = 'To';
      const account = this.userAccounts.find(acc => acc.accountNumber === receiverAccount);
      accountType = account?.accountType || 'Unknown';
    } else {
      // Fallback: show sender account if available
      accountNumber = senderAccount || receiverAccount || 'N/A';
      role = 'Account';
      const account = this.userAccounts.find(acc => acc.accountNumber === accountNumber);
      accountType = account?.accountType || 'Unknown';
    }
    
    return {
      accountType: this.getAccountTypeDisplay(accountType),
      accountNumber: accountNumber,
      role: role,
      isSender: isSender,
      isReceiver: isReceiver
    };
  }

  getTransactionAmount(transaction: any): { amount: string, isPositive: boolean, isCredit: boolean } {
    const amount = parseFloat(transaction.amount) || 0;
    const type = this.getTransactionType(transaction);
    
    // Determine if this is a credit or debit from user's perspective
    const isCredit = type === 'CREDIT';
    const isPositive = isCredit;
    
    // Format amount with proper sign
    const formattedAmount = Math.abs(amount).toFixed(2);
    const sign = isPositive ? '+' : '-';
    
    return {
      amount: `${sign}$${formattedAmount}`,
      isPositive: isPositive,
      isCredit: isCredit
    };
  }

  getTransactionDescription(transaction: any): string {
    const type = this.getTransactionType(transaction);
    const accountInfo = this.getAccountInfo(transaction);
    
    if (type === 'CREDIT') {
      return `Credit to ${accountInfo.accountType}`;
    } else if (type === 'DEBIT') {
      return `Debit from ${accountInfo.accountType}`;
    } else if (type === 'TRANSFER') {
      if (accountInfo.isSender) {
        return `Transfer to ${accountInfo.accountNumber}`;
      } else if (accountInfo.isReceiver) {
        return `Transfer from ${accountInfo.accountNumber}`;
      } else {
        return 'Transfer Transaction';
      }
    } else {
      return `${type} Transaction`;
    }
  }

  getTransactionType(transaction: any): string {
    // Get the transaction type from the backend
    const type = transaction.transactionType || transaction.type || 'TRANSFER';
    
    // Map the transaction type to display type
    switch (type.toUpperCase()) {
      case 'CREDIT':
        return 'CREDIT';
      case 'DEBIT':
        return 'DEBIT';
      case 'TRANSFER_FUNDS':
      case 'TRANSFER':
        // For transfers, determine if it's credit or debit based on the user's perspective
        const token = localStorage.getItem('jwtToken');
        const decodedToken = token ? decodeToken(token) : null;
        const currentUserId = decodedToken?.userId;
        
        // Check if current user is sender or receiver
        const isSender = transaction.senderAcc?.user?.userId === currentUserId || 
                        (transaction.user?.userId === currentUserId && transaction.senderAccountNumber);
        const isReceiver = transaction.receiverAcc?.user?.userId === currentUserId || 
                          (!isSender && transaction.receiverAccountNumber);
        
        if (isSender) {
          return 'DEBIT';
        } else if (isReceiver) {
          return 'CREDIT';
        } else {
          return 'TRANSFER';
        }
      case 'DEPOSIT':
        return 'DEPOSIT';
      case 'WITHDRAWAL':
        return 'WITHDRAWAL';
      default:
        return type.toUpperCase();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
