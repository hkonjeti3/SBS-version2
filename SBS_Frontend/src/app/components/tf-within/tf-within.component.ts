import { Component } from '@angular/core';

@Component({
  selector: 'app-tf-within',
  templateUrl: './tf-within.component.html',
  styleUrl: './tf-within.component.css'
})
export class TfWithinComponent {
  senderAccount: string = ''; // Initialize as an empty string
  receiverAccount: string = ''; // Initialize as an empty string
  transferAmount!: number;
  transferButtonDisabled: boolean = true;

  onAmountChange() {
    // Enable the transfer button if the transfer amount is valid
    this.transferButtonDisabled = isNaN(this.transferAmount) || this.transferAmount <= 0;
  }

  onTransferButtonClick() {
    // Implement logic for transferring money within the same bank
    console.log(`Transferring $${this.transferAmount} from account ${this.senderAccount} to account ${this.receiverAccount}`);
    // You can add additional logic, such as updating balances, making API calls, etc.
  }
}
