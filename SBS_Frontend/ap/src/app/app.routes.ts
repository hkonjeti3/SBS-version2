// Import the components you want to route to
import { LoginComponent } from './login/login.component';
//import { DashboardComponent } from './dashboard/dashboard.component';
import {  Routes } from '@angular/router';

// Define your routes
export const routes: Routes = [
  { path: './login/login.component', component: LoginComponent },
 // { path: 'dashboard', component: DashboardComponent },
  // Add other routes as needed
  { path: '', redirectTo: './login/login.component', pathMatch: 'full' },
];
