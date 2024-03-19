
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { decodeToken } from '../../util/jwt-helper';
import { user } from '../../services/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData!: user;
  token: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken') || '{}';
    
    const decodedToken = decodeToken(this.token);
    // console.log(decodedToken);
    if (decodedToken?.userId) {
      this.userService.getUserData(decodedToken.userId)
        .subscribe(
          (data: any) => {
            // console.log(data)
            this.userData = data;
          },
          (error) => {
            console.error('Failed to fetch user data:', error);
          }
        )
  }
}

  updateProfile(): void {
    // Redirect to a separate update page or use a modal for updating profile details
    this.router.navigate(['update'], { state: { userData: this.userData } });
  }

  deleteProfile(): void {
    // Implement logic for deleting the profile
    // For simplicity, let's just reset the user data
    this.userService.updateUserData({});
    this.router.navigate(['#']);
  }
}
