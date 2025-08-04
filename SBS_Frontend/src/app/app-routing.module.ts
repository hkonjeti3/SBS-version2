import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Shared Components
import { AuthLoginComponent } from './shared/components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './shared/components/auth-register/auth-register.component';
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

// Admin Components
import { AdminDashboardComponent } from './features/admin/components/admin-dashboard/admin-dashboard.component';
import { AdminUserManagementComponent } from './features/admin/components/admin-user-management/admin-user-management.component';
import { AdminUserDetailsComponent } from './features/admin/components/admin-user-details/admin-user-details.component';
import { AdminTransactionListComponent } from './features/admin/components/admin-transaction-list/admin-transaction-list.component';
import { AdminTransactionActionComponent } from './features/admin/components/admin-transaction-action/admin-transaction-action.component';
import { ProfileApprovalsComponent } from './features/admin/components/profile-approvals/profile-approvals.component';
import { AccountApprovalsComponent } from './features/admin/components/account-approvals/account-approvals.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AuthLoginComponent },
  { path: 'register', component: AuthRegisterComponent },
  { path: 'otp-verification', component: AuthOtpVerificationComponent },

  // Customer routes (Role 2)
  { 
    path: 'customer/dashboard', 
    component: CustomerDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/profile', 
    component: CustomerProfileComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user', 'admin', 'internal'] }
  },
  { 
    path: 'customer/accounts', 
    component: CustomerAccountComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/credit', 
    component: CustomerCreditComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/funds', 
    component: CustomerFundsComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/transaction-history', 
    component: CustomerTransactionHistoryComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/profile-update', 
    component: CustomerProfileUpdateComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/transfer-within', 
    component: CustomerTransferWithinComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/transfer-outside', 
    component: CustomerTransferOutsideComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/request-money', 
    component: CustomerRequestMoneyComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },
  { 
    path: 'customer/send-money', 
    component: CustomerSendMoneyComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user'] }
  },

  // Internal User routes (Role 6)
  { 
    path: 'internal/dashboard', 
    component: InternalUserDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['internal'] }
  },
  { 
    path: 'internal/account-management', 
    component: InternalUserAccountManagementComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['internal'] }
  },
  { 
    path: 'internal/profile-approval', 
    component: InternalUserProfileApprovalComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['internal'] }
  },
  { 
    path: 'internal/transaction-approval', 
    component: InternalUserTransactionApprovalComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['internal'] }
  },

  // Admin routes (Role 4)
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/user-management', 
    component: AdminUserManagementComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/user-details', 
    component: AdminUserDetailsComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/transaction-list', 
    component: AdminTransactionListComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/transaction/:action/:id', 
    component: AdminTransactionActionComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/approvals/profile', 
    component: ProfileApprovalsComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },
  { 
    path: 'admin/approvals/accounts', 
    component: AccountApprovalsComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] }
  },

  // Shared routes
  { 
    path: 'dashboard', 
    component: SharedDashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'internal'] }
  },

  // Legacy route redirects for backward compatibility
  { path: 'home', redirectTo: '/customer/dashboard', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/customer/profile', pathMatch: 'full' },
  { path: 'accounts', redirectTo: '/customer/accounts', pathMatch: 'full' },
  { path: 'credit', redirectTo: '/customer/credit', pathMatch: 'full' },
  { path: 'funds', redirectTo: '/customer/funds', pathMatch: 'full' },
  { path: 'tran-his', redirectTo: '/customer/transaction-history', pathMatch: 'full' },
  { path: 'update', redirectTo: '/customer/profile-update', pathMatch: 'full' },
  { path: 'tf-within', redirectTo: '/customer/transfer-within', pathMatch: 'full' },
  { path: 'tf-outside', redirectTo: '/customer/transfer-outside', pathMatch: 'full' },
  { path: 'request-money', redirectTo: '/customer/request-money', pathMatch: 'full' },
  { path: 'send-money', redirectTo: '/customer/send-money', pathMatch: 'full' },
  { path: 'home-admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin', redirectTo: '/admin/user-management', pathMatch: 'full' },
  { path: 'user-details', redirectTo: '/admin/user-details', pathMatch: 'full' },
  { path: 'transaction-list', redirectTo: '/admin/transaction-list', pathMatch: 'full' },
  { path: 'transaction/:action/:id', redirectTo: '/admin/transaction/:action/:id', pathMatch: 'full' },
  { path: 'intuser-home', redirectTo: '/internal/dashboard', pathMatch: 'full' },
  { path: 'internal-accounts', redirectTo: '/internal/account-management', pathMatch: 'full' },
  { path: 'internal-profile-updates', redirectTo: '/internal/profile-approval', pathMatch: 'full' },
  { path: 'internal-transactions', redirectTo: '/internal/transaction-approval', pathMatch: 'full' },

  // Catch all route
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }