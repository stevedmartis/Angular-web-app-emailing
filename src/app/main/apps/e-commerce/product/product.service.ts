import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { MatHorizontalStepper } from '@angular/material';


@Injectable()
export class EcommerceProductService implements Resolve<any>
{
    routeParams: any;
    product: any;
    onProductChanged: BehaviorSubject<any>;
    @ViewChild(MatHorizontalStepper, {static: true}) stepper: MatHorizontalStepper;
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

                console.log('herr'),
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

                this._httpClient.get(environment.apiUrl + '/api/event/' + this.routeParams.id)
                    .subscribe((response: any) => {
                        this.product = response;
                        console.log(this.product)

                        this.contactServices.idEventNow = this.product._id
                        this.onProductChanged.next(this.product);
                        resolve(response);

                        console.log()

                       
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
        console.log('product', product)
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/event/edit-event', 
            { eventId: product.id, 
                eventName: product.name, 
                handle: product.handle, 
                company: product.company, 
                desc: product.description, 
                dateEvent: product.date ,
                active: product.active
            })
                .subscribe((response: any) => {

                    
                    resolve(response);

                    
                    console.log(response)
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


        
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/event/add-new-event', 
            {   eventName: product.name, 
                company: product.company, 
                handle: product.handle, 
                desc: product.description, 
                dateEvent: product.date, 
                active: product.active, 

            })
                .subscribe((response: any) => {


                    this.contactServices.idEventNow = response._id;

                    //this.contactServices.eventCreated = true;
                    //this.contactServices.getContacts(this.contactServices.idEventNow)
                    resolve(response);
                    
                }, reject);
        });
    }


}
