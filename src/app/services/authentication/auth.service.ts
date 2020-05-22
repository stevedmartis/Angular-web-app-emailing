import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { User } from 'app/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from 'app/models/person';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public username: any;
  public email: any;
  public invitedPassStateUrl: any

  constructor(private http: HttpClient) {

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.currentPersonSubject = new BehaviorSubject<Person>(JSON.parse(localStorage.getItem('currentPerson')));
    this.currentPerson = this.currentPersonSubject.asObservable();
   }

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private currentPersonSubject: BehaviorSubject<Person>;
  public currentPerson: Observable<Person>;
  isLogged: boolean = false;
  loading: boolean = false;

  apiMailJet: boolean = false;

  isClient: boolean = false;
isStaff:  boolean = false;
isCreator:  boolean = false;

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
}
  public get currentPersonValue(): Person {
    return this.currentPersonSubject.value;
}

defineRolUser(rol)
{
  
  this.isClient = rol === 'Cliente'? true : false;

  this.isStaff = rol === 'Staff'? true: false;

  this.isCreator = rol === 'Creador'? true: false;


 console.log(this.isClient,  this.isStaff , this.isCreator )

}

  login(email, password) {


    return this.http.post<User>(`${environment.apiUrl}/api/login`, { email, password })
    .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    
        return user;
    }));
  }

  loginGuard(user){

    
    this.currentUserSubject.next(user);
  }

  createPerson(name) {

    console.log('entro person')

    return this.http.post<Person>(`${environment.apiUrl}/api/person`, { name })
    .pipe(map(person => {

        localStorage.setItem('currentPerson', JSON.stringify(person));
        this.currentPersonSubject.next(person);
     
        return person;
    }));
  }

  InvitedByUserId(id){

    return new Promise((resolve, reject) => {
      this.http.get(environment.apiUrl + '/api/invited/' + id)
          .subscribe((response: any) => {
              resolve(response);

              console.log(response)
          }, reject);
  });


  }


  register(email, username, password, rol) {

    return this.http.post<User>(`${environment.apiUrl}/api/register`, { email, username, password, changePassword: false, rol: rol })
    .pipe(map(person => {

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(person));
        this.currentPersonSubject.next(person);
        

        return person;
    }));
  }
}
