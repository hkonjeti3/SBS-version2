import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service'; // Adjust the path as necessary
import { account } from '../../services/account'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';
import { user } from '../../services/user';
import { decodeToken } from '../../util/jwt-helper';

@Component({
  selector: 'app-user-list',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accounts: account[] = [];
  user = new user();
  userId: number | null = null;
  token: string | undefined;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Decode the JWT token to get the userId
      const decodedToken = decodeToken(token);
      const userId = decodedToken?.userId;
      //console.log(userId);
      if (userId) {
        this.getAccounts(userId);
      } else {
        console.error('User ID is not present in the decoded token');
        // Handle the error case where the userId is not present
      }
    } else {
      console.error('JWT Token not found in local storage');
      // Handle the error case where the JWT token is not found
    }
  }

  public getAccounts(userId: number): void {
    console.log(userId);
    this.accountService.getAllAccounts(userId).subscribe(
      (response: any) => {
        console.log(response.accounts)
        this.accounts = response.accounts;
        console.log('Accounts retrieved:', this.accounts);
      },
      error => {
        console.error('There was an error retrieving accounts:', error);
      }
    );
  }
}

// public getAccounts(userId: number): void {
//     this.accountService.getAllAccounts(userId).subscribe(
//       (response: { accounts: Account[], message: string }) => { // adjust the type here to match the actual response structure
//         this.accounts = response.accounts; // <-- This is the change you need.
//         console.log('Accounts retrieved:', this.accounts);
//       },
//       error => {
//         console.error('There was an error retrieving accounts:', error);
//       }
//     );
//   }
  
