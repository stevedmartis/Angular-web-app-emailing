import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';

@Injectable()
export class EcommerceProductService implements Resolve<any>
{
    routeParams: any;
    product: any;
    onProductChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authServices: AuthService,
        private contactServices: ContactsService
    )
    {
        // Set the defaults
        this.onProductChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            console.log(this.routeParams);
            Promise.all([
                this.getProduct(),
                this.contactServices.getContacts(this.routeParams.id)
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getProduct(): Promise<any>
    {
        return new Promise((resolve, reject) => {

            console.log('this.routeParams', this.routeParams)
     
            if ( this.routeParams.id === 'new' )
            {
                this.onProductChanged.next(false);
                resolve(false);
            }
            else
            {
               
                this._httpClient.get(environment.apiUrl + '/api/evento/' + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.product = response;
                        console.log(this.product)
                        this.onProductChanged.next(this.product);
                        resolve(response);

                        console.log()

                        this.contactServices.getContacts(this.product._id)
                    }, reject);
            }
        });
    }

    /**
     * Save product
     *
     * @param product
     * @returns {Promise<any>}
     */
    saveProduct(product): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-products/' + product._id, product)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }


    /**
     * Add product
     *
     * @param product
     * @returns {Promise<any>}
     */
    addProduct(product): Promise<any> {

        const Haeader = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'authorization': `${this.authServices.currentUserValue.token}`}),
          }
        
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/evento', { name: product.name, handle: product.handle, company: product.company, description: product.description, date: product.date, status: true}, Haeader)
                .subscribe((response: any) => {

                    console.log(response)

                    this.contactServices.idEventNow = response._id;

                    this.contactServices.getContacts(this.contactServices.idEventNow)
                    resolve(response);
                    
                }, reject);
        });
    }

    deleteEvent(id) {

        const Haeader = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'authorization': `${this.authServices.currentUserValue.token}`}),
          }

          console.log(Haeader)
      
        return new Promise((resolve, reject) => {
            this._httpClient.delete(environment.apiUrl + '/api/evento/' + id,  Haeader)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
