import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service'; // Update with the correct path
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-component',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  updateForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.updateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['']  // You can add validation for the password if needed
      // Add more form controls as needed
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      // Update user data using the service
      this.userService.updateUserData(this.updateForm.value).subscribe(() => {
        console.log('User data updated successfully');
        // Optionally, you can navigate to another page or show a success message
      });
    }
  }
}
