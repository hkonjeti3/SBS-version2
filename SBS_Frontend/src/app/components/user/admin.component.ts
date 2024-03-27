import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service'; // Adjust the path as necessary
import { user } from '../../services/user'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: user[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (response: user[]) => {
        this.users = response;
        console.log('Users retrieved:', this.users);
      },
      error => {
        console.error('There was an error retrieving users:', error);
      }
    );
  }
}
