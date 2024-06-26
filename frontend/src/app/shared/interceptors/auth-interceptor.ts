import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authSerivice: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authSerivice.getToken();

        if (!token) return next.handle(request);


        const clone = request.clone({
            setHeaders: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return next.handle(clone)
    }
}