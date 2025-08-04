import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-internal-user-transaction-approval',
  templateUrl: './internal-user-transaction-approval.component.html',
  styleUrls: ['./internal-transactions.component.css']
})
export class InternalUserTransactionApprovalComponent implements OnInit {
  pendingTransactions: any[] = [];
  isLoading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    console.log('InternalTransactionsComponent initialized');
    this.loadPendingTransactions();
  }

  private loadPendingTransactions(): void {
    this.isLoading = true;
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.pendingTransactions = [
        {
          id: 1,
          senderName: 'John Doe',
          receiverName: 'Jane Smith',
          amount: 500.00,
          type: 'Transfer',
          status: 'Pending',
          timestamp: new Date()
        },
        {
          id: 2,
          senderName: 'Alice Johnson',
          receiverName: 'Bob Wilson',
          amount: 1000.00,
          type: 'Transfer',
          status: 'Pending',
          timestamp: new Date(Date.now() - 3600000)
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  approveTransaction(transactionId: number): void {
    console.log('Approving transaction:', transactionId);
    // TODO: Implement API call
    alert('Transaction approved!');
  }

  rejectTransaction(transactionId: number): void {
    console.log('Rejecting transaction:', transactionId);
    // TODO: Implement API call
    alert('Transaction rejected!');
  }
} 