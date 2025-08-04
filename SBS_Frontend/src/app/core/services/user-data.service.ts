import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user.service';
import { decodeToken } from '../utils/jwt-helper';

export interface UserData {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  address: string;
  role: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadUserDataFromToken();
  }

  private loadUserDataFromToken(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        const userData: UserData = {
          userId: decodedToken.userId,
          username: decodedToken.username || decodedToken.sub,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          emailAddress: decodedToken.email,
          phoneNumber: decodedToken.phoneNumber,
          address: decodedToken.address,
          role: decodedToken.role
        };
        this.userDataSubject.next(userData);
      }
    }
  }

  public refreshUserData(): void {
    console.log('UserDataService: Refreshing user data...');
    this.loadUserDataFromToken();
  }

  public getCurrentUserData(): UserData | null {
    return this.userDataSubject.value;
  }

  public getUserDataObservable(): Observable<UserData | null> {
    return this.userData$;
  }

  public updateUserDataFromServer(userId: number): void {
    console.log('UserDataService: Fetching updated user data from server for user ID:', userId);
    this.userService.getUserData(userId).subscribe({
      next: (userData: any) => {
        console.log('UserDataService: Received updated user data from server:', userData);
        
        // Create updated user data object
        const updatedUserData: UserData = {
          userId: userData.userId,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          emailAddress: userData.emailAddress,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          role: userData.role?.roleId || userData.roleId
        };
        
        // Update the subject with fresh data from server
        this.userDataSubject.next(updatedUserData);
        console.log('UserDataService: Updated user data subject with fresh data');
      },
      error: (error: any) => {
        console.error('UserDataService: Error fetching user data:', error);
      }
    });
  }

  public forceRefreshUserData(): void {
    console.log('UserDataService: Force refreshing user data...');
    const currentUserData = this.getCurrentUserData();
    if (currentUserData) {
      this.updateUserDataFromServer(currentUserData.userId);
    } else {
      // If no current user data, try to get from token
      const token = localStorage.getItem('jwtToken');
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken?.userId) {
          this.updateUserDataFromServer(decodedToken.userId);
        }
      }
    }
  }
} 