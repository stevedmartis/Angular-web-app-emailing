import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ResetPasswordService implements Resolve<any>
{
    products: any[];
    routeParams: any;
    onPasswordChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authServices: AuthService,
 
    ) {
        // Set the defaults
        this.onPasswordChanged = new BehaviorSubject({});
    }

    

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            this.routeParams = route.params;

                Promise.all([

                    console.log('routeParams', this.routeParams)
                
                    //this.getEventsByUser()
                    
                ]).then(
                    () => {
                        resolve();
                    },
                    reject
                );

        });
    }

    
    resetPassword(id, newPassword) {

        console.log(id, newPassword)

        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/reset-password', {id, newPassword } )
            .subscribe((response: any) => {


                console.log(response)
               

                resolve(response);
                
            }, reject);     

      })

    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */



}
