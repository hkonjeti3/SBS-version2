import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-transfer-outside',
  templateUrl: './customer-transfer-outside.component.html',
  styleUrl: './customer-transfer-outside.component.css'
})
export class CustomerTransferOutsideComponent {

  routingNumber: string = '';
  accountNumber: string = '';
  transferAmount: number | undefined;
  additionalDetails: string = '';

  transferMoney() {
    // Implement logic for transferring money outside the bank
    console.log(`Transferring $${this.transferAmount} to account ${this.accountNumber} with routing number ${this.routingNumber}`);
    // Additional logic such as API calls, validation, etc. can be added here
  }

}
