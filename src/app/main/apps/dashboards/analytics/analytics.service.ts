import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { EcommerceProductsService } from "../../e-commerce/products/products.service";
import { Product } from "../../e-commerce/product/product.model";
import { Contact } from "../../contacts/contact.model";
import { environment } from "environments/environment";
import { AuthService } from "app/services/authentication/auth.service";
import { DatePipe } from "@angular/common";

@Injectable()
export class AnalyticsDashboardService implements Resolve<any> {
    widgets: any[];
    events: Product[];
    contacts: Contact[];
    eventsArray: any[] = [];
    onClick: any[];
    siAsiste: any[];
    noAsiste: any[];
    pauseAsiste: any[];
    arrayFormatDate: Array<any> = [];
    arrayInvitedForDate: Array<any> = [];
    loadingEvents: boolean = false;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _ecommerceProductsService: EcommerceProductsService,
        private authServices: AuthService,
        public datepipe: DatePipe
    ) {}

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            Promise.all([

                this.getWidgets(),
                this.getEventForChart()]).then(() => {
                resolve();
            }, reject);
        });
    }

    getEventForChart() {
        this.loadingEvents = true;

        this.getEventsByUser().then((data: any) => {
            this.events = data.events;

            console.log(this.events);

            if (this.events.length === 0) {
                this.loadingEvents = false;
            }

            this.events.forEach(obj => {
                this.getContacts(obj._id).then(data => {

                    this.siAsiste = data.filter(x => x.asiste === "si");

                    this.noAsiste = data.filter(x => x.asiste === "no");

                    this.pauseAsiste = data.filter(x => x.asiste === "null");

                    this.onClick = data.filter(x => x.onClick === true);



                  const x =  this.sortByDate( this.onClick)



                    x.forEach(element => {
                        const obj = {
                            date: this.datepipe.transform(
                                element.dateOnClick,
                                "dd/MM/yyyy"
                            ),
                            fullDate: element.dateOnClick,
                            onClick: element.onClick
                            
                        };

                        this.arrayFormatDate.push(obj);
                    });




                     const uniqueDateOnClick = [...new Set(this.arrayFormatDate.map(obj => obj.date))];


                    this.arrayInvitedForDate = [];

                    uniqueDateOnClick.forEach(inv => {

                        const objFind = this.arrayFormatDate.filter(
                            obj => obj.date === inv
                        );


                        const objDate = {
                            date: inv,
                            count: objFind.length
                        };

                        this.arrayInvitedForDate.push(objDate);
                    });

                    console.log(
                        "arrayInvitedForDate",
                        this.arrayInvitedForDate
                    );

                    const arrayDates = this.arrayInvitedForDate.map(
                        obj => obj.date
                    );

                    const arrayCounts = this.arrayInvitedForDate.map(
                        obj => obj.count
                    );

  

                    const eventObj = {
                        id: obj._id,
                        name: obj.eventName,
                        handle: obj.handle,
                        company: obj.company,

                        widget1: {
                            scheme: {
                                domain: ['#4867d2', '#5c84f1', '#89a9f4']
                            },
                            devices: [
                                {
                                    name: "Asisten",
                                    value: this.siAsiste.length
                                },
                                {
                                    name: "Cancelan",
                                    value: this.noAsiste.length
                                },
                                {
                                    name: "Esperan",
                                    value: this.pauseAsiste.length
                                }
                            ]
                        },
                        widget5: {
                            chartType: "line",
                            datasets: {
                                today: [
                                    {
                                        label: "Aperturas",
                                        data: arrayCounts,
                                        fill: "start"
                                    }
                                ]
                            },
                            labels: arrayDates,
                            colors: [
                                {
                                    borderColor: "#3949ab",
                                    backgroundColor: "#3949ab",
                                    pointBackgroundColor: "#3949ab",
                                    pointHoverBackgroundColor: "#3949ab",
                                    pointBorderColor: "#ffffff",
                                    pointHoverBorderColor: "#ffffff"
                                },
                                {
                                    borderColor: "rgba(30, 136, 229, 0.87)",
                                    backgroundColor: "rgba(30, 136, 229, 0.87)",
                                    pointBackgroundColor:
                                        "rgba(30, 136, 229, 0.87)",
                                    pointHoverBackgroundColor:
                                        "rgba(30, 136, 229, 0.87)",
                                    pointBorderColor: "#ffffff",
                                    pointHoverBorderColor: "#ffffff"
                                }
                            ],
                            options: {
                                spanGaps: false,
                                legend: {
                                    display: false
                                },
                                maintainAspectRatio: false,
                                tooltips: {
                                    position: "nearest",
                                    mode: "index",
                                    intersect: false
                                },
                                layout: {
                                    padding: {
                                        left: 24,
                                        right: 32
                                    }
                                },
                                elements: {
                                    point: {
                                        radius: 4,
                                        borderWidth: 2,
                                        hoverRadius: 4,
                                        hoverBorderWidth: 2
                                    }
                                },
                                scales: {
                                    xAxes: [
                                        {
                                            gridLines: {
                                                display: false
                                            },
                                            ticks: {
                                                fontColor: "rgba(0,0,0,0.54)"
                                            }
                                        }
                                    ],
                                    yAxes: [
                                        {
                                            gridLines: {
                                                tickMarkLength: 16
                                            },
                                            ticks: {
                                                stepSize: 1000
                                            }
                                        }
                                    ]
                                },
                                plugins: {
                                    filler: {
                                        propagate: false
                                    }
                                }
                            }
                        }
                    };

                    this.eventsArray.push(eventObj);

             setTimeout(() => {
                this.loadingEvents = false;

             }, 1000);
                
                   

                    console.log("eventObj", eventObj);
                });
            });
        });
    }

    getEventsByUser(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(
                    environment.apiUrl +
                        "/api/events/user/" +
                        this.authServices.currentUserValue.user._id
                )
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    getContacts(idEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/invited/event/" + idEvent)
                .subscribe((response: any) => {
                    console.log(response);

                    this.contacts = response.invited;
                    resolve(this.contacts);
                }, reject);
        });
    }

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/analytics-dashboard-widgets")
                .subscribe((response: any) => {
    
                    this.widgets = response

                    resolve(response);
                }, reject);
        });
    }



    sortByDate(arr) {
        arr.sort(function(a,b){
          return Number(new Date(a.dateOnClick)) - Number(new Date(b.dateOnClick));
        });
    
        return arr;
      }
}
