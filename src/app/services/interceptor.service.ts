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
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    
   
    let request = req;

    if (currentUser) {

      const token = currentUser.token;

      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': `beader ${ token }`
        }
      });
    }
    else {

      request = req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
         
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
