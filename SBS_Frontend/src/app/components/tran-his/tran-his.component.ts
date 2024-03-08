import { Component } from '@angular/core';

@Component({
  selector: 'app-tran-his',
  templateUrl: './tran-his.component.html',
  styleUrl: './tran-his.component.css'
})
export class TranHisComponent {
  transactions: any[] = [
    { date: '2022-03-01', description: 'Online Purchase', amount: -50.0 },
    { date: '2022-03-05', description: 'Salary Deposit', amount: 1500.0 },
    { date: '2022-03-10', description: 'ATM Withdrawal', amount: -100.0 },
    // Add more transactions as needed
  ];

}
