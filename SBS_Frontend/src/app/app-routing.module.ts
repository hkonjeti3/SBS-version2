import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateComponent } from './components/update/update.component';
import { CreditComponent } from './components/credit/credit.component';
import { FundsComponent } from './components/funds/funds.component';
import { TfWithinComponent } from './components/tf-within/tf-within.component';
import { TfOutsideComponent } from './components/tf-outside/tf-outside.component';
import { TranHisComponent } from './components/tran-his/tran-his.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { TransactionActionComponent } from './components/transaction-action/transaction-action.component';
import { InternalUserHomeComponent } from './components/internal-user-home/internal-user-home.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'home',
    component:HomeComponent
  },
  {
    path:'profile',
    component: ProfileComponent
  },
  {
    path:'update',
    component: UpdateComponent
  },
  {
    path:'credit',
    component: CreditComponent

  },
  {
    path:'funds',
    component: FundsComponent
  },
  {
    path: 'tf_within',
    component: TfWithinComponent
  },
  { path: 'tf_outside', 
  component: TfOutsideComponent 
  },
  {
    path: 'tran-his',
    component: TranHisComponent
  },
  {
    path: 'update',
    component:UpdateComponent
  },
  {
    path: 'user-details',
    component:UserDetailsComponent
  },
  {
    path: 'otp-verification', 
    component: OtpVerificationComponent
  },
  {
    path:'', redirectTo:'register',pathMatch:'full'
    
  },
  // Adding routes for transaction management
  { path: 'intuser-home', 
  component: InternalUserHomeComponent },
  { path: 'intuser-home/transactions', 
  component: TransactionListComponent }, // Use a different path for transactions
  { path: 'intuser-home/transaction-action', 
  component: TransactionActionComponent }, // Use a different path for transaction action
  { path: 'transaction/:action/:id', component: TransactionActionComponent },
  { path: '', redirectTo: 'intuser-home', pathMatch: 'full' },

  // Routes for user and internal user home pages with role-based redirection
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['user'] } },
  { path: 'intuser-home', component: InternalUserHomeComponent, canActivate: [AuthGuard], data: { roles: ['internal'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }