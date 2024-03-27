import { user } from './user'; // Adjust the import path as necessary
import { account } from './account'; // Adjust the import path as necessary

export class transaction {

  transactionId?: string;
  user?: user;
  senderAcc?: account;
  receiverAcc?: account;
  transactionType: string | undefined | null;
  amount?: string;
  createdBy?: string;
  createdtime?: Date;
  lastModifiedBy?: string;
  lastModifiedtime?: Date;
  status?: string;

  constructor(
    user: user,
    // senderAcc: account,
    // receiverAcc: account,
    // transactionType: string,
    // amount: string,
    // status: string
  ) {
    this.user = user;
    // this.senderAcc = senderAcc;
    // this.receiverAcc = receiverAcc;
    // this.transactionType = transactionType;
    // this.amount = amount;
    // this.status = status;
    // Optionally set the createdtime to the current time
    // this.createdtime = new Date();
  }
}

// export class Transaction {
//     transactionId?: string;
//     userId: string;
//     senderAcc: string; // Assuming the account is identified by a string
//     receiverAcc: string;
//     transactionType: string;
//     amount: string;
//     status: string;
  
//     constructor(
//       userId: string,
//       senderAcc: string,
//       receiverAcc: string,
//       transactionType: string,
//       amount: string,
//       status: string
//     ) {
//       this.userId = userId;
//       this.senderAcc = senderAcc;
//       this.receiverAcc = receiverAcc;
//       this.transactionType = transactionType;
//       this.amount = amount;
//       this.status = status;
//     }
//   }
  