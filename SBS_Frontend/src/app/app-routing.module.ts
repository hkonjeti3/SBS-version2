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
//import { ProfileComponent } from './profile/profile.component';

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
    path:'', redirectTo:'home',pathMatch:'full'
    
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }