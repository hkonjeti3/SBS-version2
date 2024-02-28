
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
  }

  updateProfile(): void {
    // Redirect to a separate update page or use a modal for updating profile details
    this.router.navigate(['update']);
  }

  deleteProfile(): void {
    // Implement logic for deleting the profile
    // For simplicity, let's just reset the user data
    this.userService.updateUserData({});
    this.router.navigate(['#']);
  }
}
