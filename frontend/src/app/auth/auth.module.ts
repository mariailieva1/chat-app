import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPage } from './pages/auth/auth.page';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

const PAGES = [
  AuthPage
]

@NgModule({
  declarations: [
    ...PAGES,
  ],
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  providers: []
})
export class AuthModule { }
