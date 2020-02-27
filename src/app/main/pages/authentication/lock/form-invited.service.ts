import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class FormInvitedService implements Resolve<any>
{
    
    routeParams: any;

    onInvitedChanged: BehaviorSubject<any>;
    campaignId: any
    invitedId: any
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            this.routeParams = route.params;

            this.campaignId = this.routeParams.campaignId;

            this.invitedId = this.routeParams.invitedId;

        
                Promise.all([

                    this.getCampaignById(this.campaignId),


                    this.getInvited()
                    .then(() => {


                        resolve();

                    }, reject)

                    //this.getEventsByUser()

                    
                    
                ]).then(
                    () => {
                        resolve();
                    },
                    reject
                );

        });
    }


    getCampaignById(idCampaign) {




        console.log(idCampaign)

        return new Promise((resolve, reject) => {



            this._httpClient.get(environment.apiUrl + '/api/get-campaign/' + idCampaign )
            .subscribe((response: any) => {

                console.log(response)

                
                        
                this.campaignInvitation = response.campaign;

                this.campaignName = this.campaignInvitation.affair;

                console.log( this.campaignInvitation)

                resolve(response);
                
            }, reject);   
            
            

      })

    }

    
    getInvited(): Promise<any>{

    return new Promise((resolve, reject) => {


            console.log('elseseeee', this.invitedId)

      this._httpClient.get(environment.apiUrl + '/api/invitedConfirm/' + this.invitedId)
          .subscribe((response: any) => {
              resolve(response);

              console.log(response)

              this.invited = response

              this.onInvitedChanged.next(this.invited);
              resolve(response)

              console.log(response)
          }, reject);
        
  });
    

  }


    
  confirmInvitation(invited) {



        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/invited/confirm-invited', invited )
            .subscribe((response: any) => {

                console.log(response)

               
            
                resolve(response);
                
            }, reject);     

      })

    }

    /**
     * Get products
     *
     * @returns {Promise<any>}
     */

}
