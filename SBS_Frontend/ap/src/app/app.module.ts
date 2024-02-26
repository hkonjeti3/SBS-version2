import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
//import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {FormGroup} from '@angular/forms';
//import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RouterOutlet,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }