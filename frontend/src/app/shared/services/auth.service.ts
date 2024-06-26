import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '@common/interfaces/user.interface'
import { catchError, tap } from 'rxjs';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }

    isAuthenticated() {
        return !!this.getToken();
    }

    singUp(user: User) {
        return this.http.post<{ message: string, token: string }>('/api/auth/signup', user).pipe(tap(res => {
            if (res.token)
                this.setToken(res.token)


            if (res.message)
                this.snackBar.open(res.message, 'Close', { verticalPosition: 'top', duration: 5000 })
        }))
    }

    singIn(user: User) {
        return this.http.post<{ message: string, token: string }>('/api/auth/signin', user).pipe(tap(res => {
            if (res.token)
                this.setToken(res.token)

            if (res.message)
                this.snackBar.open(res.message, 'Close', { verticalPosition: 'top', duration: 5000 })
        }))
    }

    getUserInfo() {
        return this.http.get<User>('/api/auth/user').pipe(catchError(async _ => { this.deleteToken(); return undefined }))
    }

    setToken(token: string) {
        sessionStorage.setItem('token', token)
    }

    deleteToken() {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login'])
    }

    getToken() {
        return sessionStorage.getItem('token')
    }

    logout() {
        this.deleteToken();
    }
} 