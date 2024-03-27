import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreditService } from '../../services/credit.service';
import { transaction } from '../../services/transaction'; // Adjust the import path as necessary
import { account } from '../../services/account'; // Adjust the import path as necessary
import { user } from "../../services/user"
import { UserService } from '../../services/user.service';
import { decodeToken } from '../../util/jwt-helper';

function isTransactionType(type: string): type is 'CREDIT' | 'DEBIT' {
  return type === 'CREDIT' || type === 'DEBIT';
}

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.css']
})

export class CreditComponent implements OnInit{
  //transaction = new transaction(new account(), new account(), 'CREDIT', '0', 'PENDING'); // Initialize with empty values or however you see fit
  senderAcc = new account();
  receiverAcc = new account();
  user = new user();
  transaction= new transaction(this.user);
  userId: number | null = null; // Initialize to null
  token: string | undefined;

  constructor(private creditService: CreditService,
    private userService: UserService) {}

    ngOnInit(): void {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        // Decode the JWT token to get the userId
        const decodedToken = decodeToken(token);
        const userId = decodedToken?.userId;
        if (userId) {
          // If we have a userId, initialize the transaction with it
          this.initializeTransaction(userId);
        } else {
          console.error('User ID is not present in the decoded token');
          // Handle the error case where the userId is not present
        }
      } else {
        console.error('JWT Token not found in local storage');
        // Handle the error case where the JWT token is not found
      }
      
    }

    initializeTransaction(userId: number): void {
      // Initialize your transaction here with the userId
      // Ensure your Transaction model accepts a userId in its constructor
      this.user.userId = userId
      this.transaction = new transaction(this.user); // The empty string is for the account number which will be filled in the form
    }


  submitTransaction(form: NgForm) {
    if (form.valid) {
      const upperCaseType = form.value.transactionType.toUpperCase();
      this.senderAcc.accountNumber = form.value.senderAccount;
      this.transaction.senderAcc = this.senderAcc;
      console.log(form.value)
      this.receiverAcc.accountNumber = form.value.receiverAccount;
      this.transaction.receiverAcc = this.receiverAcc;

      this.transaction.transactionType = form.value.transactionType;
      this.transaction.amount = form.value.amount;
      console.log(this.transaction);
      if (isTransactionType(upperCaseType)) {
        console.log(this.transaction);
        this.creditService.performTransaction(upperCaseType, this.transaction)
          .subscribe({
            next: (response: any) => {
              //console.log('Transaction successful', response);
              console.log('Response from backend:', response);
              if (typeof response === 'string' && response.endsWith('created successfully')) {
                //console.log('User signed up successfully!');
                alert('Request created successfully!');
              }
              else{
                console.error('Unexpected response from backend:', response);
                alert('Unexpected response from backend');
              }
              // Handle successful transaction here (e.g., display a success message)
            },
            error: (error) => {
              console.error('Transaction failed', error);
              // Handle transaction failure here (e.g., display an error message)
            }
          });
      } else {
        console.error('Invalid transaction type');
        // Handle invalid transaction type here
      }
    }
  }
  
}


// submitTransaction(form: NgForm): void {
//     if (form.valid && this.userId) {
//       // Make sure userId is set before attempting to perform transaction
//       this.creditService.performTransaction(this.transaction).subscribe({
//         next: response => {
//           console.log('Transaction successful', response);
//           // Handle successful transaction here (e.g., display a success message)
//         },
//         error: error => {
//           console.error('Transaction failed', error);
//           // Handle transaction failure here (e.g., display an error message)
//         }
//       });
//     } else {
//       console.error('Form is invalid or userId is not set');
//       // Handle form or userId error
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { CreditService } from '../../services/credit.service';
// import { transaction } from '../../services/transaction'; // Adjust the import path as necessary
// import { account } from '../../services/account'; // Adjust the import path as necessary

// function isTransactionType(type: string): type is 'CREDIT' | 'DEBIT' {
//   return type === 'CREDIT' || type === 'DEBIT';
// }

// @Component({
//   selector: 'app-credit',
//   templateUrl: './credit.component.html',
//   styleUrls: ['./credit.component.css']
// })
// export class CreditComponent implements OnInit {
//   transaction = new transaction(new account(), new account(), 'CREDIT', '0', 'PENDING'); // Initialize with empty values or however you see fit
//   transaction: transaction;

//   // Assume this is the logged-in user's ID.
//   // In a real application, you would retrieve this from an authentication service.
//   userId: string = 'user123'; 

//   constructor(private creditService: CreditService) { }

//   ngOnInit(): void {
//     // Assuming that the 'userId' can be fetched from a service or state management
//     // Initialize your transaction here with the 'userId'
//     // For this example, let's assume 'userId' is '12345'
//     this.transaction = new transaction('12345', 'CREDIT', '0', 'PENDING'); // 'senderAccount' and 'receiverAccount' will be set via form
//   }

//   submitTransaction(form: NgForm) {
//     if (form.valid) {
//       const upperCaseType = this.transaction.transactionType.toUpperCase();
//       if (upperCaseType === 'CREDIT' || upperCaseType === 'DEBIT') {
//         this.creditService.performTransaction(upperCaseType, this.transaction)
//           .subscribe({
//             next: (response) => {
//               console.log('Transaction successful', response);
//               // Handle successful transaction here (e.g., display a success message)
//             },
//             error: (error) => {
//               console.error('Transaction failed', error);
//               // Handle transaction failure here (e.g., display an error message)
//             }
//           });
//       } else {
//         console.error('Invalid transaction type');
//         // Handle invalid transaction type here
//       }
//     }
//   }
// }