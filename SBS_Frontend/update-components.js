const fs = require('fs');
const path = require('path');

// Component mapping for renaming
const componentMapping = {
  // Customer components
  'customer-dashboard': { oldClass: 'HomeComponent', newClass: 'CustomerDashboardComponent', oldSelector: 'app-home', newSelector: 'app-customer-dashboard' },
  'customer-profile': { oldClass: 'ProfileComponent', newClass: 'CustomerProfileComponent', oldSelector: 'app-profile', newSelector: 'app-customer-profile' },
  'customer-account': { oldClass: 'AccountComponent', newClass: 'CustomerAccountComponent', oldSelector: 'app-account', newSelector: 'app-customer-account' },
  'customer-credit': { oldClass: 'CreditComponent', newClass: 'CustomerCreditComponent', oldSelector: 'app-credit', newSelector: 'app-customer-credit' },
  'customer-funds': { oldClass: 'FundsComponent', newClass: 'CustomerFundsComponent', oldSelector: 'app-funds', newSelector: 'app-customer-funds' },
  'customer-transaction-history': { oldClass: 'TranHisComponent', newClass: 'CustomerTransactionHistoryComponent', oldSelector: 'app-tran-his', newSelector: 'app-customer-transaction-history' },
  'customer-profile-update': { oldClass: 'UpdateComponent', newClass: 'CustomerProfileUpdateComponent', oldSelector: 'app-update', newSelector: 'app-customer-profile-update' },
  'customer-transfer-within': { oldClass: 'TfWithinComponent', newClass: 'CustomerTransferWithinComponent', oldSelector: 'app-tf-within', newSelector: 'app-customer-transfer-within' },
  'customer-transfer-outside': { oldClass: 'TfOutsideComponent', newClass: 'CustomerTransferOutsideComponent', oldSelector: 'app-tf-outside', newSelector: 'app-customer-transfer-outside' },
  'customer-send-money': { oldClass: 'SendMoneyComponent', newClass: 'CustomerSendMoneyComponent', oldSelector: 'app-send-money', newSelector: 'app-customer-send-money' },
  'customer-request-money': { oldClass: 'RequestMoneyComponent', newClass: 'CustomerRequestMoneyComponent', oldSelector: 'app-request-money', newSelector: 'app-customer-request-money' },
  
  // Internal user components
  'internal-user-dashboard': { oldClass: 'InternalUserHomeComponent', newClass: 'InternalUserDashboardComponent', oldSelector: 'app-internal-user-home', newSelector: 'app-internal-user-dashboard' },
  'internal-user-account-management': { oldClass: 'InternalAccountsComponent', newClass: 'InternalUserAccountManagementComponent', oldSelector: 'app-internal-accounts', newSelector: 'app-internal-user-account-management' },
  'internal-user-profile-approval': { oldClass: 'InternalProfileUpdatesComponent', newClass: 'InternalUserProfileApprovalComponent', oldSelector: 'app-internal-profile-updates', newSelector: 'app-internal-user-profile-approval' },
  'internal-user-transaction-approval': { oldClass: 'InternalTransactionsComponent', newClass: 'InternalUserTransactionApprovalComponent', oldSelector: 'app-internal-transactions', newSelector: 'app-internal-user-transaction-approval' },
  'internal-user-header': { oldClass: 'HeaderInternalComponent', newClass: 'InternalUserHeaderComponent', oldSelector: 'app-header-internal', newSelector: 'app-internal-user-header' },
  
  // Admin components
  'admin-dashboard': { oldClass: 'HomeAdminComponent', newClass: 'AdminDashboardComponent', oldSelector: 'app-home-admin', newSelector: 'app-admin-dashboard' },
  'admin-user-management': { oldClass: 'AdminComponent', newClass: 'AdminUserManagementComponent', oldSelector: 'app-admin', newSelector: 'app-admin-user-management' },
  'admin-user-details': { oldClass: 'UserDetailsComponent', newClass: 'AdminUserDetailsComponent', oldSelector: 'app-user-details', newSelector: 'app-admin-user-details' },
  'admin-transaction-list': { oldClass: 'TransactionListComponent', newClass: 'AdminTransactionListComponent', oldSelector: 'app-transaction-list', newSelector: 'app-admin-transaction-list' },
  'admin-transaction-action': { oldClass: 'TransactionActionComponent', newClass: 'AdminTransactionActionComponent', oldSelector: 'app-transaction-action', newSelector: 'app-admin-transaction-action' },
  'admin-header': { oldClass: 'HeaderAdminComponent', newClass: 'AdminHeaderComponent', oldSelector: 'app-header-admin', newSelector: 'app-admin-header' },
  
  // Shared components
  'auth-login': { oldClass: 'LoginComponent', newClass: 'AuthLoginComponent', oldSelector: 'app-login', newSelector: 'app-auth-login' },
  'auth-register': { oldClass: 'RegisterComponent', newClass: 'AuthRegisterComponent', oldSelector: 'app-register', newSelector: 'app-auth-register' },
  'shared-header': { oldClass: 'HeaderComponent', newClass: 'SharedHeaderComponent', oldSelector: 'app-header', newSelector: 'app-shared-header' },
  'shared-dashboard': { oldClass: 'DashboardComponent', newClass: 'SharedDashboardComponent', oldSelector: 'app-dashboard', newSelector: 'app-shared-dashboard' },
  
  // Auth components
  'auth-otp-verification': { oldClass: 'OtpVerificationComponent', newClass: 'AuthOtpVerificationComponent', oldSelector: 'app-otp-verification', newSelector: 'app-auth-otp-verification' }
};

function updateComponentFile(filePath, componentName) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  const mapping = componentMapping[componentName];
  if (!mapping) {
    console.log(`No mapping found for component: ${componentName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Update class name
  content = content.replace(new RegExp(`export class ${mapping.oldClass}`, 'g'), `export class ${mapping.newClass}`);
  
  // Update selector
  content = content.replace(new RegExp(`selector: '${mapping.oldSelector}'`, 'g'), `selector: '${mapping.newSelector}'`);
  
  // Update template and style URLs
  content = content.replace(/templateUrl: '\.\/.*\.component\.html'/g, `templateUrl: './${componentName}.component.html'`);
  content = content.replace(/styleUrl: '\.\/.*\.component\.css'/g, `styleUrl: './${componentName}.component.css'`);
  
  // Update imports to use new core structure
  content = content.replace(/from '\.\.\/\.\.\/services\//g, 'from \'../../../../core/services/');
  content = content.replace(/from '\.\.\/\.\.\/util\//g, 'from \'../../../../core/utils/');
  content = content.replace(/from '\.\.\/services\//g, 'from \'../../../core/services/');
  content = content.replace(/from '\.\.\/util\//g, 'from \'../../../core/utils/');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated: ${filePath}`);
}

// Update all component files
Object.keys(componentMapping).forEach(componentName => {
  const componentPath = `src/app/features/customer/components/${componentName}/${componentName}.component.ts`;
  updateComponentFile(componentPath, componentName);
  
  const internalPath = `src/app/features/internal-user/components/${componentName}/${componentName}.component.ts`;
  updateComponentFile(internalPath, componentName);
  
  const adminPath = `src/app/features/admin/components/${componentName}/${componentName}.component.ts`;
  updateComponentFile(adminPath, componentName);
  
  const sharedPath = `src/app/shared/components/${componentName}/${componentName}.component.ts`;
  updateComponentFile(sharedPath, componentName);
  
  const authPath = `src/app/auth/${componentName}/${componentName}.component.ts`;
  updateComponentFile(authPath, componentName);
});

console.log('Component files updated successfully!'); 