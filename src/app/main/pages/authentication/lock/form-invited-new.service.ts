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
import { AuthService } from "app/services/authentication/auth.service";
import { map } from "rxjs/operators";

@Injectable()
export class FormInvitedNewService implements Resolve<any> {
    routeParams: any;

    onInvitedChanged: BehaviorSubject<any>;
    campaignId: any;
    campaignInvitation: any;
    event: any;
    eventId: any;
    eventLoad: boolean = false;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(private _httpClient: HttpClient, private router: Router) {
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

            Promise.all([
                this.getCampaignById(this.campaignId).then(() => {
                    this.getEventById(this.campaignInvitation.eventId).then(
                        (data) => {

                            this.event = data.event;

                            if (!this.event.active) {
                                window.location.href =
                                    "http://www.turevento.net/";
                            }

                            this.eventLoad = true;
                        }
                    );
                }),

                //this.getEventsByUser()
            ]).then(() => {
                resolve();
            }, reject);
        });
    }

    getCampaignById(idCampaign) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/get-campaign/" + idCampaign)
                .subscribe((response: any) => {
                    this.campaignInvitation = response.campaign;

                    resolve(response);
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

    addNewInvitation(obj): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/invited/add-new-invited/", obj)

                .subscribe((response: any) => {
                    resolve(response);
                });
        });
    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */
}
