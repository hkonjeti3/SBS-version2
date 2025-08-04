import { user } from './user';

export class account{
    accountId: string | undefined ;
    user: user | undefined ;
    accountNumber: string | undefined | null;
    accountType: string | undefined | null;
    balance: string | undefined | null;
    status: string | undefined | null;
}