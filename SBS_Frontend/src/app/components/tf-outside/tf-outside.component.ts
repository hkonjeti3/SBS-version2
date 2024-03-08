import { Component } from '@angular/core';

@Component({
  selector: 'app-tf-outside',
  templateUrl: './tf-outside.component.html',
  styleUrl: './tf-outside.component.css'
})
export class TfOutsideComponent {

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
