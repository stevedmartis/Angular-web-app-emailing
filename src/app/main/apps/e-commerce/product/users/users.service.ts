import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from 'environments/environment';
import { FuseUtils } from "@fuse/utils";
import { User } from 'app/models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  selectedContacts: string[] = [];
  onSelectedContactsChanged: BehaviorSubject<any>;
  onContactsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  public loadingContact: boolean = false;
  contactsExist: boolean = false;
  searchText: string;
  idEventNow: any;
  filterBy: string;
  users: User[];


  constructor(private _httpClient: HttpClient,) {
    this.onSelectedContactsChanged = new BehaviorSubject([]);
    this.onContactsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
  }

   resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
        Promise.all([

          console.log('entro users')
,            this.getUsersByIdEvent(this.idEventNow)
            //this.getUserData()
        ]).then(([files]) => {
            this.onSearchTextChanged.subscribe(searchText => {
                this.searchText = searchText;
                this.getUsersByIdEvent(this.idEventNow);
            });

            this.onFilterChanged.subscribe(filter => {
                this.filterBy = filter;
                this.getUsersByIdEvent(this.idEventNow);
            });

            resolve();
        }, reject);
    });
}

getUsersByIdEvent(idEvent): Promise<any> {
  return new Promise((resolve, reject) => {
      this._httpClient
          .get(environment.apiUrl + "/api/invited/event/" + idEvent)
          .subscribe((response: any) => {
             

              this.users = response.invited;


              if (this.searchText && this.searchText !== "") {
                 

                  this.users = FuseUtils.filterArrayByString(
                      this.users,
                      this.searchText
                  );
              }

              this.users = this.users.map(user => {
                  return new User(user);
              });

           

              this.onContactsChanged.next(this.users);
              resolve(this.users);
          }, reject);
  });
}


  toggleSelectedContact(id): void {
    // First, check if we already have that contact as selected...
    if (this.selectedContacts.length > 0) {
        const index = this.selectedContacts.indexOf(id);

        if (index !== -1) {
            this.selectedContacts.splice(index, 1);

            // Trigger the next event
            this.onSelectedContactsChanged.next(this.selectedContacts);

            // Return
            return;
        }
    }

    // If we don't have it, push as selected
    this.selectedContacts.push(id);

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
}
}
