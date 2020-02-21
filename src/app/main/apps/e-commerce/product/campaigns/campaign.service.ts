import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { EcommerceProductService } from '../product.service';
import { Campaign } from './campaign.model';

@Injectable()
export class CampaignService
{
    routeParams: any;
    campaigns: Campaign[] = []
    onCampaignhanged: BehaviorSubject<any>;
    userId = this._authServices.currentUserValue.user._id;
    token = this._authServices.currentUserValue.token;
    image: any;
    idEventNow: any

    eventId = this._productService.product.event._id;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _authServices: AuthService,
        private _productService: EcommerceProductService,
        
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

                        const allCampaigs = response.campaigns

                       const campByEvent =  allCampaigs.filter(x => x.eventId === this._productService.idNowEvent)

                        console.log('map by id:', this._productService.idNowEvent, campByEvent)
                        this.campaigns = campByEvent;
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

    addCampaign(campaign): Promise<any> {
console.log('campaign', campaign, this.eventId)

        
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/campaign/add-new-campaign', 
            {  
                user: this.userId,
                codeEvent: this.idEventNow,
                affair: campaign.asunto,
                sender: campaign.remitente,
                imgBlob: this.image,
                aditional: campaign.notes
            })
                .subscribe((response: any) => {

                    this.campaigns.push(response.post);
                    this.onCampaignhanged.next(this.campaigns);

                    resolve(response);
                    
                }, reject);
        });
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

