import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { EcommerceProductService } from '../product.service';

@Injectable()
export class CampaignService
{
    routeParams: any;
    campaigns: any;
    onCampaignhanged: BehaviorSubject<any>;
    userId = this._authServices.currentUserValue.user._id;
    token = this._authServices.currentUserValue.token;

    //eventId = this._productService.product._id;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _authServices: AuthService,
        private _productService: EcommerceProductService
    )
    {
        // Set the defaults
        this.onCampaignhanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */


    /**
     * Get product
     *
     * @returns {Promise<any>}
     */
    getCampaigns(): Promise<any>
    


    {
      
        return new Promise((resolve, reject) => {

         // console.log('eventId', this.eventId)
            console.log('this._authServices.currentUserValue', this._authServices.currentUserValue)

                this._httpClient.get(environment.apiUrl + '/api/campaign-user/' + this.userId)
                    .subscribe((response: any) => {
                        this.campaigns = response.campaigns;
                       

                        this.onCampaignhanged.next(this.campaigns);
                        resolve(response);
                       
                    }, reject);
                  })
  
    }

    /**
     * Save product
     *
     * @param product
     * @returns {Promise<any>}
     */
    addCampaign(){

      window.open('http://localhost:4200/#/editor/design/' + this.userId + '/' + this.token , '_blank')
    }

    deleteCampaign(campaign) {

      console.log(campaign)

    
      return new Promise((resolve, reject) => {
          this._httpClient.delete(environment.apiUrl + '/api/delete-campaign/' + campaign._id)
              .subscribe((response: any) => {
                  resolve(response);

                  const campaignIndex = this.campaigns.indexOf(campaign);
                  this.campaigns.splice(campaignIndex, 1);

                  this.onCampaignhanged.next(this.campaigns);

                  console.log(response)
              }, reject);
      });
  }

    


  

}

