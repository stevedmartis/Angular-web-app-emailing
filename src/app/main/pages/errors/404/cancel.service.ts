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
export class CancelInvitationService implements Resolve<any> {
    routeParams: any;

    campaignId: any;
    invitedId: any;
    campaignInvitation: any;
    invited: any;
    campaignName: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authServices: AuthService,
        //private router: Router
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
            this.routeParams = route.params;

            this.campaignId = this.routeParams.campaignId;

            Promise.all([
                this.getCampaignById(this.campaignId)
                .then(() => {
                    resolve();
                }, reject)

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

                    this.campaignName = this.campaignInvitation.affair;

                

                    console.log(this.campaignInvitation);

                    resolve(response);
                }, reject);
        });
    }
}
