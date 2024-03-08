import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
//import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
//import { HeaderComponent } from './components/header/header.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateComponent } from './components/update/update.component';
import { CreditComponent } from './components/credit/credit.component';
import { FundsComponent } from './components/funds/funds.component';
import { HeaderComponent } from './components/header/header.component';
import { TfWithinComponent} from './components/tf-within/tf-within.component';
import { TfOutsideComponent } from './components/tf-outside/tf-outside.component';
import { TranHisComponent } from './components/tran-his/tran-his.component';

//import { TfInstantComponent } from './components/tf-instant/tf-instant.component';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgModule } from '@angular/core';
//import { ReactiveFormsModule } from '@angular/forms';
//import { UpdateComponent } from './path-to-your-update-component/update.component'; // Update the path
//import { ProfileComponent } from './profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    ProfileComponent,
    UpdateComponent,
    CreditComponent,
    FundsComponent,
    TfWithinComponent,
    TfOutsideComponent,
    TranHisComponent,
    //TfInstantComponent,
    //ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    FormsModule,
    HttpClientModule,
    //NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
