import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core
import { AuthGuard } from './core/guards/auth.guard';
import { SecurityInterceptor } from './core/interceptors/security.interceptor';

// Shared Components
import { AuthLoginComponent } from './shared/components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './shared/components/auth-register/auth-register.component';
import { SharedHeaderComponent } from './shared/components/shared-header/shared-header.component';
import { SharedDashboardComponent } from './shared/components/shared-dashboard/shared-dashboard.component';

// Auth Components
import { AuthOtpVerificationComponent } from './auth/auth-otp-verification/auth-otp-verification.component';

// Customer Components
import { CustomerDashboardComponent } from './features/customer/components/customer-dashboard/customer-dashboard.component';
import { CustomerProfileComponent } from './features/customer/components/customer-profile/customer-profile.component';
import { CustomerAccountComponent } from './features/customer/components/customer-account/customer-account.component';
import { CustomerCreditComponent } from './features/customer/components/customer-credit/customer-credit.component';
import { CustomerFundsComponent } from './features/customer/components/customer-funds/customer-funds.component';
import { CustomerTransactionHistoryComponent } from './features/customer/components/customer-transaction-history/customer-transaction-history.component';
import { CustomerProfileUpdateComponent } from './features/customer/components/customer-profile-update/customer-profile-update.component';
import { CustomerTransferWithinComponent } from './features/customer/components/customer-transfer-within/customer-transfer-within.component';
import { CustomerTransferOutsideComponent } from './features/customer/components/customer-transfer-outside/customer-transfer-outside.component';
import { CustomerSendMoneyComponent } from './features/customer/components/customer-send-money/customer-send-money.component';
import { CustomerRequestMoneyComponent } from './features/customer/components/customer-request-money/customer-request-money.component';

// Internal User Components
import { InternalUserDashboardComponent } from './features/internal-user/components/internal-user-dashboard/internal-user-dashboard.component';
import { InternalUserAccountManagementComponent } from './features/internal-user/components/internal-user-account-management/internal-user-account-management.component';
import { InternalUserProfileApprovalComponent } from './features/internal-user/components/internal-user-profile-approval/internal-user-profile-approval.component';
import { InternalUserTransactionApprovalComponent } from './features/internal-user/components/internal-user-transaction-approval/internal-user-transaction-approval.component';
import { InternalUserHeaderComponent } from './features/internal-user/components/internal-user-header/internal-user-header.component';

// Admin Components
import { AdminDashboardComponent } from './features/admin/components/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from './features/admin/components/admin-user-management/admin-user-management.component';
import { AdminUserDetailsComponent } from './features/admin/components/admin-user-details/admin-user-details.component';
import { AdminTransactionListComponent } from './features/admin/components/admin-transaction-list/admin-transaction-list.component';
import { AdminTransactionActionComponent } from './features/admin/components/admin-transaction-action/admin-transaction-action.component';
import { AdminHeaderComponent } from './features/admin/components/admin-header/admin-header.component';
import { ProfileApprovalsComponent } from './features/admin/components/profile-approvals/profile-approvals.component';
import { AccountApprovalsComponent } from './features/admin/components/account-approvals/account-approvals.component';

// Shared Pipes
import { CapitalizePipe } from './shared/pipes/capitalize.pipe';

// Add missing component imports
import { PasswordMatchDirective } from './shared/password-match.directive';

@NgModule({
  declarations: [
    AppComponent,
    
    // Shared Components
    AuthLoginComponent,
    AuthRegisterComponent,
    SharedHeaderComponent,
    SharedDashboardComponent,
    
    // Auth Components
    AuthOtpVerificationComponent,
    
    // Customer Components
    CustomerDashboardComponent,
    CustomerProfileComponent,
    CustomerAccountComponent,
    CustomerCreditComponent,
    CustomerFundsComponent,
    CustomerTransactionHistoryComponent,
    CustomerProfileUpdateComponent,
    CustomerTransferWithinComponent,
    CustomerTransferOutsideComponent,
    CustomerSendMoneyComponent,
    CustomerRequestMoneyComponent,
    
    // Internal User Components
    InternalUserDashboardComponent,
    InternalUserAccountManagementComponent,
    InternalUserProfileApprovalComponent,
    InternalUserTransactionApprovalComponent,
    InternalUserHeaderComponent,
    
    // Admin Components
    AdminDashboardComponent,
    AdminUserManagementComponent,
    AdminUserDetailsComponent,
    AdminTransactionListComponent,
    AdminTransactionActionComponent,
    AdminHeaderComponent,
    ProfileApprovalsComponent,
    AccountApprovalsComponent,
    
    // Shared Pipes
    CapitalizePipe,
    
    // Shared Directives
    PasswordMatchDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SecurityInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
