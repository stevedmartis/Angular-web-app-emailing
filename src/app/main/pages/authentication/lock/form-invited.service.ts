import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot,
    Router
} from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "environments/environment";
import { AuthService } from "app/services/authentication/auth.service";
import { map } from "rxjs/operators";

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

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authServices: AuthService,
        private router: Router
    ) {
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
                    console.log(res);
                    const linkBol = res.campaign.webLinkCharge;
                    const linkString = res.campaign.webLink;

                    if (linkBol) {
                        console.log(linkString);

                        this.onClickEditInvited()
                        .then((x) => {

                            console.log('x', x)
                        window.location.href = linkString;

                        return;

                        })

                    }

                    

                    this.editInvited = true;

                    this.getEventById(this.campaignInvitation.eventId).then(
                        data => {
                            console.log(data);

                            this.event = data.event;

                            this.eventLoad = true;
                        }
                    );
                }),

                this.getInvited().then(() => {


                    setTimeout(() => {

                        this.onClickEditInvited()
                        .then((x) => {
    
                            console.log('x', x)
                            
                            resolve(x)
    
                        })
                        
                    }, 500);

                    
                    

                }, reject)

                //this.getEventsByUser()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }

    getCampaignById(idCampaign) {
        console.log(idCampaign);

        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/get-campaign/" + idCampaign)
                .subscribe((response: any) => {
                    console.log(response);

                    this.campaignInvitation = response.campaign;

                    this.campaignName = this.campaignInvitation.affair;

                    console.log(this.campaignInvitation);

                    resolve(response);
                }, reject);
        });
    }

    getInvited(): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("elseseeee", this.invitedId);

            this._httpClient
                .get(
                    environment.apiUrl +
                        "/api/invited-confirm/" +
                        this.invitedId
                )
                .subscribe((response: any) => {
                    resolve(response);

                    console.log(response);

                    this.invited = response;

                    this.onInvitedChanged.next(this.invited);
                    resolve(response);

                    console.log(response);
                }, reject);
        });
    }

    getEventById(idEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/event/" + idEvent)
                .subscribe((response: any) => {
                    resolve(response);

                    console.log(response);
                }, reject);
        });
    }

    confirmInvitation(invited) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(
                    environment.apiUrl + "/api/invited/confirm-invited",
                    invited
                )
                .subscribe((response: any) => {
                    console.log(response);

                    resolve(response);
                }, reject);
        });
    }

    onClickEditInvited() {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/invited/onClick", {
                    invitedId: this.invitedId,
                    onClick: true
                })
                .subscribe((response: any) => {
                    console.log(response);

                    resolve(response);
                }, reject);
        });
    }
}
