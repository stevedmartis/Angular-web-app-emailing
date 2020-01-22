import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  public username: any;
  public email: any;

  constructor(private http: HttpClient) {

   }


  isLogged: boolean = false;
  loading: boolean = false;


  forgotPassword(email) {

    return this.http.post<any>(`${environment.apiUrl}/api/forgot-password`, { email })
    .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('currentUser', JSON.stringify(user));
    
        return user;
    }));
  }

  sendMailJet(email, username, _id) {

      return this.http.post<any>(`${environment.apiUrl}/api/send-mail-jet`, { email , username, _id})
      .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          //localStorage.setItem('currentUser', JSON.stringify(user));
      
          return user;
      }));
  }
}
