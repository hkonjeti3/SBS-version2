

// login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup} from '@angular/forms';
// login.component.ts
import { FormsModule } from '@angular/forms';
//import { FormsModule } from '@angular/forms';



// Import login-related components
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
//import { FormGroup } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
    // ... other login-related components
  ],
  imports: [
    CommonModule,
    //FormsModule,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
     // Add this line for ReactiveFormsModule
    // ... other modules
  ],
})
export class LoginModule {}
