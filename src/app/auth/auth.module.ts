import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
import { SharedModule } from '../shared/shared.module';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    NbAuthModule.forRoot(),
    GooglePlaceModule
  ]
})
export class AuthModule { }
