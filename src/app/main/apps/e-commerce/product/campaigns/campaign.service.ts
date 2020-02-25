import { Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { EcommerceProductService } from '../product.service';
import { Campaign } from './campaign.model';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { map } from 'rxjs/operators';
import { ImgSrcDirective } from '@angular/flex-layout';

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
    base64Image: any;

    allLoading: boolean = false;
    selectLoading: boolean = false;
    value = 0;
    allContacts = this._contactService.contacts.length;
    selectedContacts = this._contactService.selectedContacts.length;
    statusSendInvitation = '';


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _authServices: AuthService,
        private _productService: EcommerceProductService,
        public _contactService: ContactsService


        
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

console.log('campaign', campaign, this._productService.idNowEvent)        
        return new Promise((resolve, reject) => {
            this._httpClient.post(environment.apiUrl + '/api/campaign/add-new-campaign', 
            {  
                user: this.userId,
                codeEvent: this._productService.idNowEvent,
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

    
  getDataPersonForSendEmail(invitation, option){

   

    console.log('invitation', invitation)

    console.log('contacts all: ', this._contactService.contacts);


    
    console.log('contacts selects: ', this._contactService.selectedContacts)

    if(option === 'all'){

        this.allLoading = true;

        console.log('allllll')
        const arrayInvitedSelected = this._contactService.contacts;


        console.log('arrayInvitedSelected', arrayInvitedSelected)

        const array = arrayInvitedSelected.map( obj => obj.id)
        this.invitedArrayforSend(array, invitation);


    }
    else {
        this.selectLoading = true;

        console.log('select')

        const arrayInvitedSelected = this._contactService.selectedContacts;

        console.log('arrayInvitedSelected', arrayInvitedSelected);

        this.invitedArrayforSend(arrayInvitedSelected,invitation);
        


    }

  }

  invitedArrayforSend(array, invitation){


    array.forEach(obj => {

        console.log(obj)

        this._authServices.InvitedByUserId(obj)
        .then( (person ) => {
            

            console.log(person)
            
            this.sendInvited(invitation, person)
            .subscribe( (mail ) => {
                console.log(mail)

                this.value ++

                console.log( this.value)


                if(this.value === array.length){

                   this.value = 100;

                   this.statusSendInvitation = 'Completado!'

                   console.log('ok')
                }

                   
            },
            
            error => {
                this.value ++
              },)
            
            
        })

       
    });

  }

  sendInvited(invitation, person){


    const imagen =  invitation.imgBlob.substr(22)
        
    const obj = {
        _id: invitation._id,
        affair: invitation.affair,
        sender: invitation.sender,
        imgBlob: imagen,
          _idInvited: person.invited._id,
            emailInvited: person.invited.email,
            nameInvited: person.invited.name,


    }

    return this._httpClient.post<any>(`${environment.apiUrl}/api/send-invited`, obj)
    .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('currentUser', JSON.stringify(user));
    console.log(user)
        return user;
    }));


    }






  

}



