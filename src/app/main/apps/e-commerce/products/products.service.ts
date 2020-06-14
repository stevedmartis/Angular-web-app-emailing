import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';


@Injectable()
export class EcommerceProductsService implements Resolve<any>
{
    products: any[];
    onProductsChanged: BehaviorSubject<any>;

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
        this.onProductsChanged = new BehaviorSubject({});
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

                Promise.all([
                
                    this.getEventsByUser(),
                    
                ]).then(
                    () => {
                        resolve();
                    },
                    reject
                );

        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
    getProducts(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-products')
                .subscribe((response: any) => {
                    this.products = response;

 
                    this.onProductsChanged.next(this.products);
                    resolve(response);
                }, reject);
        });
    }


    getEventsByUser(): Promise<any> {

        console.log('user ',this.authServices.currentUserValue)

        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiUrl + '/api/events/user/' + this.authServices.currentUserValue.user._id )
                .subscribe((response: any) => {
                    
                
                    let eventArray: any = []
                    let count = 0;

                    response.events.forEach(e => {
                        count++
                        e.displayId = count
                        e.id = e._id
                        

                        eventArray.push(e)
                       
                    });

                    console.log(eventArray)

                    this.products = eventArray;

                    this.onProductsChanged.next(this.products);

                    console.log(this.onProductsChanged)
                    resolve(response);


                }, reject);
        });

    }



    getAllEvents(): Promise<any> {

        console.log('user ',this.authServices.currentUserValue.token)


        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiUrl + '/api/all-events')
                .subscribe((response: any) => {
                    
                    
                    let eventArray: any = []
                    let count = 0;

                    response.events.forEach(e => {
                        count++
                        e.displayId = count
                        e.id = e._id
                        

                        eventArray.push(e)
                       
                    });


                    this.products = eventArray;

                    this.onProductsChanged.next(this.products);

                    resolve(this.products);


                }, reject);
        });

    }

    deleteEvent(product) {


      
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.apiUrl + '/api/delete-event/' + product._id)
                .subscribe((response: any) => {
                    resolve(response);


                        this.deleteAllInputsByEvent(product)
                        .then((res) => {

                            console.log(res)
                     

                    this.deleteAllInvitedByEvent(product)
                    .then((data) =>{


                        console.log(data)



                        const productIndex = this.products.indexOf(product);
                        this.products.splice(productIndex, 1);
    
                        this.onProductsChanged.next(this.products);


                    })

                })



               
                }, reject);
        });
    }

    deleteAllInvitedByEvent(product) {


      
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.apiUrl + '/api/delete-all-invited/event/' + product._id)
                .subscribe((response: any) => {
                    resolve(response);

                    

               
                }, reject);
        });
    }

    deleteAllInputsByEvent(product) {


      
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.apiUrl + '/api/delete-all-inputs/event/' + product._id)
                .subscribe((response: any) => {
                    resolve(response);

                    

               
                }, reject);
        });
    }

}
