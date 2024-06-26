import { Component } from '@angular/core';
import { User } from '@common/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrl: './auth.page.scss'
})
export class AuthPage {
  isSignIn = true;

  user: User = {
    name: '',
    email: '',
    password: '',
  };

  get overlayTitle() {
    return this.isSignIn ? "Hello, Friend!" : "Welcome back!";
  }

  get overlayText() {
    return this.isSignIn ? "Enter your personal details and start journey with us" : "To keep connected with us please login with your personal info";
  }

  get overlayClass() {
    return this.isSignIn ? "overlay-right" : "overlay-left";
  }

  get overlayButton() {
    return this.isSignIn ? "Sign up" : "Sign in";
  }

  constructor(private authService: AuthService, private router: Router) { }

  async singUp(form: NgForm) {
    if (form.invalid) return;

    await lastValueFrom(this.authService.singUp(this.user))
    this.router.navigate(['/'])
  }

  async signIn(form: NgForm) {
    if (form.invalid) return;

    await lastValueFrom(this.authService.singIn(this.user))
    this.router.navigate(['/'])
  }
}
