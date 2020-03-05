import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EcommerceProductsService } from '../../e-commerce/products/products.service';
import { Product } from '../../e-commerce/product/product.model';
import { Contact } from '../../contacts/contact.model';
import { environment } from 'environments/environment';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    widgets: any[];
    events: Product[];
    contacts: Contact[];
    eventsArray: any[] = [];
    siAsiste: any[];
    noAsiste: any[];
    pauseAsiste: any[]

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private  _ecommerceProductsService: EcommerceProductsService,
    )
    {
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
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getWidgets(),
                this.getEvents(),
                

            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getEvents(){

        this._ecommerceProductsService.getEventsByUser()
        .then( (data: any) => {

            this.events = data.events;

            console.log(this.events)

            this.events.forEach(obj => {

                this.getContacts(obj._id)
                .then(( data) => {
                    console.log(data)

                   this.siAsiste = data.filter((x) => x.asiste === 'si')

                   this.noAsiste = data.filter((x) => x.asiste === 'no')

                   this.pauseAsiste = data.filter((x) => x.asiste === 'null')

                
                    const eventObj = 
                        {
                            id: obj._id,
                            name: obj.eventName,
                            handle: obj.handle,
                            company: obj.company,

                            scheme: {
                                domain: [
                                    "#46ef72", 
                                    "#ff6a00",
                                    "#0065ff"
                                ]
                            },
                                devices: [
                                    {name: "Asisten", value: this.siAsiste.length },
                                    {name: "Cancelan", value: this.noAsiste.length },
                                    {name: "Esperan", value: this.pauseAsiste.length }

                                ],

                          
                        }

                        this.eventsArray.push(eventObj)
                    

                    console.log('eventObj', eventObj)
                })
                
            });

           



        })

    }

    getContacts(idEvent): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiUrl + '/api/invited/event/' + idEvent)
                .subscribe((response: any) => {

                    console.log(response)

                    this.contacts = response.invited;
                    resolve(this.contacts)

                }, reject);
        }
        );
    }


    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/analytics-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }
}
