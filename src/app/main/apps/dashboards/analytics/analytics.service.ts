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
    statusSent: any[];
    statusOpen: any[];
    statusClicked: any[];
    arrayFormatDate: Array<any> = [];
    arrayInvitedForDate: Array<any> = [];
    loadingEvents: boolean = false;
    countAllInvited: any;
    allInvited: any[];
    percentSent: any;
    percentOpen: any;
    percentClicked: any;

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
                this.getContacts(obj._id)
                .then(data => {

                    console.log('data',data)
                
                    let allOk: any[] = data.filter(x => x.messageOk === true);

                    console.log(allOk)

                    this.countAllInvited = allOk.length;

                    this.siAsiste = data.filter(x => x.asiste === "si");

                    this.noAsiste = data.filter(x => x.asiste === "no");

                    this.pauseAsiste = data.filter(x => x.asiste === "0");

                    this.onClick = data.filter(x => x.onClick === true);

                    this.statusSent = data.filter(x => x.Status === 'sent');

                    this.statusOpen = data.filter(x => x.Status === 'opened');

                    this.statusClicked = data.filter(x => x.Status === 'clicked');

            

                    this.percentSent = (this.countAllInvited  * 100 )/data.length;

                    this.percentOpen = ( this.statusOpen.length  * 100 )/  this.countAllInvited;

                    this.percentClicked = ( this.statusClicked.length  * 100 )/  this.countAllInvited;

                   

                    const x =  this.sortByDate(this.onClick);

                    let  myDate = new Date();

                    let toDay = this.datepipe.transform(
                        myDate,
                        "EEEE dd/LLL"
                    )

                    console.log(toDay)                

                    const label = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00','07:00', '08:00', '09:00', '10:00', 
                                    '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']

                    x.forEach(element => {

                      
                        const obj = {
                            date: this.datepipe.transform(
                                element.dateOnClick,
                                "EEEE dd/LLL"
                            ),
                            fullDate: element.dateOnClick,
                            onClick: element.onClick
                            
                        };

                        console.log(obj)

                        this.arrayFormatDate.push(obj);
                    });

                    
                     let dataStatusSent = this.dataStatus(this.statusSent);

                     let dataStatusOpen = this.dataStatus(this.statusOpen);

                     let dataStatusClicked = this.dataStatus(this.statusClicked);
    


                     
                    console.log(dataStatusSent);
                    console.log(dataStatusOpen);
                    console.log(dataStatusClicked);


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
                        countInvited: obj.countInvited,

                        widget1: {
                            toDay: toDay,
                            chartType: 'line',

                            datasets : {
                                'toDay': [

                                    {
                                        label: 'Clicked',
                                        data : dataStatusClicked,
                                        fill : 'start'
                
                                    },
                                    {
                                        label: 'Abiertos',
                                        data : dataStatusOpen,
                                        fill : 'start'
                
                                    },


                                    
                                    {
                                        label: 'Sin respuesta',
                                        data : dataStatusSent,
                                        fill : 'start'
                
                                    },
                                ],


                
                            },
                            labels   :label,
                            colors   : [
                                {
                                    borderColor              : '#42a5f5',
                                    backgroundColor          : '#42a5f5',
                                    pointBackgroundColor     : '#1e88e5',
                                    pointHoverBackgroundColor: '#ffffff',
                                    pointBorderColor         : '#ffffff',
                                    pointHoverBorderColor    : '#ffffff'
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

                            
                        },

                        widget3: {
                            scheme: {
                                domain: ['#4867d2', '#5c84f1', '#89a9f4']
                            },
                            devices: [
                                {
                                    name: "Asisten",
                                    value: this.siAsiste? this.siAsiste.length: 0
                                },
                                {
                                    name: "Cancelan",
                                    value: this.noAsiste? this.noAsiste.length: 0
                                },
                                {
                                    name: "Esperan",
                                    value:this.pauseAsiste? this.pauseAsiste.length: 0
                                }
                            ]
                        },
                        widget5: {
                            chartType: "line",
                            datasets: {
                                today: [
                                    {
                                        label: "Aperturas",
                                        data: arrayCounts? arrayCounts: 0,
                                        fill: "start"
                                    }
                                ]
                            },
                            labels: arrayDates,
                            colors: [
                                {
                                    borderColor              : '#42a5f5',
                                    backgroundColor          : '#42a5f5',
                                    pointBackgroundColor     : '#1e88e5',
                                    pointHoverBackgroundColor: '#1e88e5',
                                    pointBorderColor         : '#ffffff',
                                    pointHoverBorderColor    : '#ffffff'
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

        
                this.loadingEvents = false;

     
                
                   

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

      dataStatus(arrayStatus){

        let arrayStatusTimes = [];

        arrayStatus.forEach(item => {

            const obj = {
                time: this.datepipe.transform(
                    item.StatusDateTime,
                    "HH"
                ),
 
            };

            arrayStatusTimes.push(obj)

        })

        console.log(arrayStatusTimes)

        const dataStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0];

            let count00 = 1;
            let count01 = 1;
            let count02 = 1;
            let count03 = 1;
            let count04 = 1;
            let count05 = 1;
            let count06 = 1;
            let count07 = 1;
            let count08 = 1;
            let count09 = 1;
            let count10 = 1;
            let count11 = 1;
            let count12 = 1;
            let count13 = 1;
            let count14 = 1;
            let count15 = 1;
            let count16 = 1;
            let count17 = 1;
            let count18 = 1;
            let count19 = 1;
            let count20 = 1;
            let count21 = 1;
            let count22 = 1;
            let count23 = 1;
           
            
            arrayStatusTimes.forEach(item => {

            switch (item.time) {
                case "00":
                   
                    dataStatus[0] = count00++;

                    break;
                case "01":
                   
                    dataStatus[1] = count01++;

                    break;
                case "02":
                   
                    dataStatus[2] = count02++;

                    break;
                case "03":
                   
                    dataStatus[3] = count03++;

                    break;
                case "04":
                   
                    dataStatus[4] = count04++;

                    break;
                case "05":
                   
                    dataStatus[5] = count05++;

                    break;
                case "06":
                   
                    dataStatus[6] = count06++;

                    break;
                case "07":
                   
                    dataStatus[7] = count07++;

                    break;
                case "08":
                   
                    dataStatus[8] = count08++;

                    break;
                case "09":
                   
                    dataStatus[9] = count09++;

                    break;
                case "10":
                   
                    dataStatus[10] = count10++;

                    break;
                case "11":
                   
                    dataStatus[11] = count11++;

                    break;
                case "12":
                   
                    dataStatus[12] = count12++;

                    break;
                case "13":
                   
                    dataStatus[13] = count13++;

                    break;
                case "14":
                   
                    dataStatus[14] = count14++;

                    break;
                case "15":
                   
                    dataStatus[15] = count15++;

                    break;

                case "16":
                   
                    dataStatus[16] = count16++;

                    break;

                case "17":
                   
                    dataStatus[17] = count17++;

                    break;
                case "18":
                   
                    dataStatus[18] = count18++;

                    break;
                case "19":
                   
                    dataStatus[19] = count19++;

                    break;                                                               
                case "20":
                   
                    dataStatus[20] = count20++;

                    break;
                case "21":
                   
                    dataStatus[21] = count21++;

                    break;     
                case "22":
                   
                    dataStatus[22] = count22++;

                    break;                                                                                      
                case "23":
                   
                    dataStatus[23] = count23++;

                    break;                                
                default:
                    break;
            }
        })

        return dataStatus;
      }


}
