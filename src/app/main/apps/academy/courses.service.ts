import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { User } from 'app/models/user';
import { map, tap, last, catchError } from "rxjs/operators";

@Injectable()
export class AcademyCoursesService implements Resolve<any>
{
    onCategoriesChanged: BehaviorSubject<any>;
    onCoursesChanged: BehaviorSubject<any>;
    eventObj: any;

    arrayUserData: any[] = [] 
    emailExist: boolean = false;
usernameExist : boolean = false;

emailValid: boolean = false;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onCategoriesChanged = new BehaviorSubject({});
        this.onCoursesChanged = new BehaviorSubject({});
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getCategories(),
                this.getCourses()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get categories
     *
     * @returns {Promise<any>}
     */
    getCategories()
    {

        let selectRol = [
            {label: 'Creador', value: '1'},
            {label: 'Staff', value: '2'},
            {label: 'Cliente', value: '3'},
          
            ]

            this.onCategoriesChanged.next(selectRol);
          

    }

    /**
     * Get courses
     *
     * @returns {Promise<any>}
     */
    getCourses(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/academy-courses')
                .subscribe((response: any) => {
                    this.onCoursesChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    addUser(obj) {

            obj.changePassword = true;

      return new Promise((resolve, reject) => {
        this._httpClient.post<User>(`${environment.apiUrl}/api/register`, obj)
            .subscribe((response: any) => {
       
                resolve(response);
            }, reject);
        })

}

saveUserEvent(): Promise<any>
{


   

    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/event/edit-users', 
        {   eventId:  this.eventObj._id,
            users:  this.eventObj.users
        })
            .subscribe((response: any) => {

            
            

                
                resolve(response);

                
           
            }, reject);
    });
}

getUsersData(){

  

if( this.eventObj.users){

    let users = this.eventObj.users.map(user => user.userId)


    users.forEach(userId => {

     

        this.getUser(userId)

    });


}




this.onCoursesChanged.next(this.arrayUserData);
 


}



getUser(id): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient
            .get(environment.apiUrl + "/api/user/" + id)
            .subscribe((response: User) => {

                let objUser = response.user;

           

                if(objUser){

                let obj = {
                    _id: objUser._id,
                    name: objUser.name,
                    lastName: objUser.lastName,
                    username: objUser.username,
                    email: objUser.email,
                    rol: objUser.rol,
                    updated: objUser.updated
                }

                this.arrayUserData.push(obj)

                

                resolve(obj)

            }
                
            }, reject);
    });
}

deleteUser(user) {



                const userIndex = this.arrayUserData.indexOf(user);
                this.arrayUserData.splice(userIndex, 1);


                this.onCoursesChanged.next(this.arrayUserData);

                this.eventObj.users.splice(userIndex, 1)


               this.saveUserEvent()

}


removeUser(user): Promise<any> {



    return new Promise((resolve, reject) => {
        this._httpClient
            .delete(environment.apiUrl + "/api/delete-user/" + user._id)
            .subscribe((res: any) => {
               
                
    const userIndex = this.arrayUserData.indexOf(user);
    this.arrayUserData.splice(userIndex, 1);


    this.onCoursesChanged.next(this.arrayUserData);

    this.eventObj.users.splice(userIndex, 1)

    this.saveUserEvent()


    resolve(res)
            }, reject);
    });


}

getUserByUsername(username): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient
            .post(environment.apiUrl + "/api/username/", {username: username})
            .subscribe((response: User) => {
           
                resolve(response)
            }, reject);
    });
}

getUserByEmail(email): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient
            .post(environment.apiUrl + "/api/forgot-password/", {email: email})
            .subscribe((response: User) => {
            
                resolve(response)
            }, reject);
    });
}


editUser(user): Promise<any>
{

    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/edit-user', 
        {   userId: user._id,
            name: user.name,
            username: user.username,
            lastName: user.lastName,
            email: user.email,
            rol: user.rol
        })
            .subscribe((response: any) => {

                const userIndex = this.arrayUserData.findIndex(x => x._id === response.user._id);

                
                this.arrayUserData[userIndex].name = user.name

                this.arrayUserData[userIndex].lastName = user.lastName;
                this.arrayUserData[userIndex].email = user.email;
                this.arrayUserData[userIndex].username = user.username;
                this.arrayUserData[userIndex].rol = user.rol;

                this.arrayUserData[userIndex].updated = response.user.updated;

                this.onCoursesChanged.next(this.arrayUserData);
                resolve(response);

                
                
            }, reject);
    });
}

editUserExist(user): Promise<any>
{

    return new Promise((resolve, reject) => {
        this._httpClient.post(environment.apiUrl + '/api/edit-user', 
        {   userId: user._id,
            name: user.name,
            username: user.username,
            lastName: user.lastName,
            email: user.email,
            rol: user.rol
        })
            .subscribe((response: any) => {
    

                this.arrayUserData.push(response.user)

                this.onCoursesChanged.next(this.arrayUserData);
                resolve(response);

                


                
            
            }, reject);
    });
}

   
validateEmail(email): Promise<any> {
    return new Promise((resolve, reject) => {
        this._httpClient
            .get(environment.apiUrl + "/api/validate-email/" + email)
            .subscribe((response: any) => {
              

                resolve(response.result.data.debounce.result)
            }, reject);
    });
}

emailValidator(email: string) : Observable<any> {
    
    return this._httpClient.get(environment.apiUrl + "/api/validate-email/" + email)


}



sendMailJet(email, username, _id, password): Promise<any> {

 

    return new Promise((resolve, reject) => { 
        this._httpClient.post<any>(`${environment.apiUrl}/api/send-new-user-mail`, { email , username, _id, password})
    .subscribe((user: any) => {

        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('currentUser', JSON.stringify(user));

        resolve(user)
    
        return user;
    }, reject)

    })

}

}




