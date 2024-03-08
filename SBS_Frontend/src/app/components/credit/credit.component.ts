// credit.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})
export class CreditComponent {
  creditAmount: number = 0;
  creditDescription: string = '';

  performCredit() {
    // Add logic to perform credit operation
    console.log('Credit performed:', this.creditAmount, this.creditDescription);
    // You may want to communicate with a service or perform other actions here
  }
}
