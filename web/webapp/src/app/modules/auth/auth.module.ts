import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [CommonModule, AuthRoutingModule],
  declarations: [
    ForgotPasswordComponent
  ],
})
export class AuthModule {}
