import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
    Router,
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "environments/environment";
import { ContactsService } from 'app/main/apps/contacts/contacts.service';

@Injectable()
export class FormInvitedService implements Resolve<any> {
    routeParams: any;
    onInvitedChanged: BehaviorSubject<any>;
    campaignId: any;
    invitedId: any;
    campaignInvitation: any;
    invited: any;
    campaignName: any;
    event: any;
    eventLoad: boolean = false;
    editInvited: boolean = false;
    loadingPage: boolean = false;
    openEvent: boolean = false;
    invitedExist: boolean = false;
    arrayInputsSelect: any[ ] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient) {
        // Set the defaults
        this.onInvitedChanged = new BehaviorSubject({});
    }

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
            this.routeParams = route.params;

            this.campaignId = this.routeParams.campaignId;

            this.invitedId = this.routeParams.invitedId;


            Promise.all([
                this.getCampaignById(this.campaignId).then((res: any) => {
              

                    this.editInvited = true;


                    this.getEventById(this.campaignInvitation.eventId).then(
                        (data) => {

                            
                    
                    this.event = data.event;

                    console.log(data)
                    this.eventLoad = true;


                            this.getInputsEvent(data.event._id)
                            .then((res) => {

                                console.log(res)
                                this.arrayInputsSelect = res.inputs.filter(x => {
                                    return x.column === 2;
                                })
                                console.log( this.arrayInputsSelect)

                                
                            if (this.invitedId !== "new") {
    
                                this.getInvited()
                                .then((res) => {

                                    console.log(res)

                                    this.invitedExist = true;

                                    this.onInvitedChanged.next(this.invited);

                                })

                  
                            } else {
                                this.onInvitedChanged.next({});
                                this.invitedExist = false;
                            }

                        });
                        }
                    );
                }),

                //this.getEventsByUser()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }



    getInputsEvent(idEvent): Promise<any> {

    
        return new Promise((resolve, reject) => {
            this._httpClient.get(environment.apiUrl + '/api/form/event/' + idEvent)
                .subscribe((response: any) => {
    
             
                    resolve(response);
                    
                }, reject);
        });
    }



    getCampaignById(idCampaign) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/get-campaign/" + idCampaign)
                .subscribe((response: any) => {
                    this.campaignInvitation = response.campaign;

                    this.campaignName = this.campaignInvitation.affair;

                

                    const linkBol = response.campaign.webLinkCharge;
                    const linkString = response.campaign.webLink;

                    if (linkBol) {
                    

                        this.onClickEditInvited().then((x) => {
                        
                            window.location.href = linkString;

                            return;
                        });
                    } else {
                        this.loadingPage = true;
                    }

                    resolve(response);

                     

                }, reject);
        });
    }

    getInvited(): Promise<any> {
        return new Promise((resolve, reject) => {
         

            this._httpClient
                .get(
                    environment.apiUrl +
                        "/api/invited-confirm/" +
                        this.invitedId
                )
                .subscribe((response: any) => {
                    resolve(response);


                    this.invited = response;

                 
                    resolve(response);

              
                }, reject);
        });
    }

    getInvitedByEvent(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/invited/event/" + this.event._id)
                .subscribe((response: any) => {

                    console.log(response)
                    let invited = response.invited


                    resolve(invited);

                }, reject);
        });
    }

    getEventById(idEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/event/" + idEvent)
                .subscribe((response: any) => {
                    resolve(response);

                }, reject);
        });
    }

    confirmInvitation(id, obj) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.apiUrl + "/api/invited/confirm-invited",
                    {  invitedId: id, dataInvited: obj,  }
                )
                .subscribe((response: any) => {
                   

                    resolve(response);
                }, reject);
        });
    }

    addNewInvitation(dataObj): Promise<any> {

        return new Promise((resolve, reject) => {
           
            this._httpClient
                .post(environment.apiUrl + "/api/invited/add-new-invited/", dataObj)
                

                .subscribe((response: any) => {
                    resolve(response);
                  
                });
        });
    }

    onClickEditInvited() {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/invited/onClick", {
                    invitedId: this.invitedId,
                    onClick: true,
                })
                .subscribe((response: any) => {
                   

                    resolve(response);
                }, reject);
        });
    }

    validateEmail(email): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/validate-email/" + email)
                .subscribe((response: any) => {
                    let result = response.result.data.debounce.result;
                    console.log(result);
                    let valid =
                        result === "Invalid"
                            ? false
                            : result === "Risky"
                            ? false
                            : result === "Safe to Send"
                            ? true
                            : result === "Unknown"
                            ? true
                            : null;

                    resolve(valid);
                }, reject);
        });
    }
}
