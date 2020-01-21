import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './authentication/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(private authServices: AuthService,
              private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this.authServices.currentUserValue.token;

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `beader ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          this.router.navigate(['pages/auth/login']);
        }

        return throwError( err );

      })
    );
  }



}
