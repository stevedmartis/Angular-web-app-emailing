import { Injectable, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { environment } from 'environments/environment';
import { AuthService } from 'app/services/authentication/auth.service';
import { EcommerceProductService } from '../product.service';
import { Campaign } from './campaign.model';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { map, tap, last, catchError } from 'rxjs/operators';
import { ImgSrcDirective } from '@angular/flex-layout';


export class FileUploadModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
    type: string;
  }
 

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
    invitedFails: any[] = [];

    value200: 0

    loadingFile: boolean = false; 

    
    previewUrl:any = null;
    previewLoading: boolean = false;
    previewLoadingEvent: boolean = false;
    value500: 0;
    fileUp: any;
    imgProductLoad: boolean = false;
    eventOpen: boolean = false;

    @Input() text = 'Upload';
    @Input() param = 'file';
  @Input() target = 'https://file.io';


    previewUrlEvent: any;

  private files: Array<FileUploadModel> = [];
  
  fileData: File = null;



    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _authServices: AuthService,
        public _productService: EcommerceProductService,
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
                affair: campaign.affair,
                sender: campaign.sender,
                nameSender: campaign.nameSender,
                imgBlob: this.image,
                footer: campaign.footer,
                messageConfirm: campaign.messageConfirm,
                messageCancel: campaign.messageCancel

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

  editCampaign(campaign): Promise<any> {

    console.log('campaign', campaign, this._productService.idNowEvent)        
            return new Promise((resolve, reject) => {
                this._httpClient.post(environment.apiUrl + '/api/campaign/edit', 
                {  
                    //user: this.userId,
                    campaignId: campaign.id,
                    affair: campaign.affair,
                    sender: campaign.sender,
                    nameSender: campaign.nameSender,
                    imgBlob: this.previewUrl,
                    messageConfirm: campaign.messageConfirm,
                    messageCancel: campaign.messageCancel,
                    footer: campaign.footer
    
                })
                .subscribe((response: any) => {
                 
                  resolve(response);
                  console.log(response)

                  this.getCampaigns()
                      .then(x => {
                         // this.loadingContact = false;
                      })
              });
            });
        }

    
  getDataPersonForSendEmail(invitation, option){

   

    console.log('invitation', invitation)

    console.log('contacts all: ', this._contactService.contacts);


    
    console.log('contacts selects: ', this._contactService.selectedContacts)

    if(option === 'all'){

        this.allLoading = true;

        console.log('allllll')
        const arrayInvitedAll = this._contactService.contacts;
      const arrayNew = []
      arrayInvitedAll.forEach(c => {
            if(c.email){
               arrayNew.push(c)
            }
            else {
              return;
            }


        });

        console.log(arrayNew)
        const array = arrayNew.map( obj => obj.id)



          this.invitedArrayforSend(array, invitation);

          
      
    }
    else {
        this.selectLoading = true;

        console.log('select')

        const arrayInvitedSelected = this._contactService.selectedContacts;



          this.invitedArrayforSend(arrayInvitedSelected,invitation);


    }

  }

  invitedArrayforSend(array, invitation){

    setTimeout(() => {

    array.forEach(obj => {

        console.log(obj)

        this._authServices.InvitedByUserId(obj)
        .then( (person: any ) => {
            
       
          if(person.invited.email){

        
            this.sendInvited(invitation, person)
            .subscribe( (mail ) => {
    

                this.value ++

                this.value200 ++




                if(this.value === array.length){

                   this.value = 100;

                   this.statusSendInvitation = 'Enviado!'

                   console.log('ok')
                }

                   
            },
            
            error => {

                this.value ++
               
console.log(' error ',  this.value, array.length)



                    this.statusSendInvitation = 'Enviado!';


                    console.log('ok error')

                    this._authServices.InvitedByUserId(obj)
                    .then( (x:any) => {
                        console.log(x)

                        this.invitedFails.push(x.invited);

                       console.log( this.invitedFails)

                       this.value = 100;

                    })

                    




 

              },)

            }
            
            
        })

       
    });

  }, 500)

  }

  sendInvited(invitation, person){


    console.log(invitation)
    const imagen =  invitation.imgBlob.substr(22)
        
    const obj = {
        _id: invitation._id,
        affair: invitation.affair,
        nameSender: invitation.nameSender,
        sender: invitation.sender,
        imgBlob: imagen,
        _idInvited: person.invited._id,
        emailInvited: person.invited.email,
        nameInvited: person.invited.name + ' ' + person.invited.lastname,


    }

    return this._httpClient.post<any>(`${environment.apiUrl}/api/send-invited`, obj)
    .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        //localStorage.setItem('currentUser', JSON.stringify(user));
    console.log(user)
        return user;
    }));


    }



    
    
     uploadFile(file: FileUploadModel) {
        this.loadingFile = true;
        const fd = new FormData();
        fd.append(this.param, file.data);
    
        const req = new HttpRequest('POST', this.target, fd, {
          reportProgress: true
        });
    
        file.inProgress = true;
        file.sub = this._httpClient.request(req).pipe(
          map(event => {
           
            switch (event.type) {
                  case HttpEventType.UploadProgress:
                        file.progress = Math.round(event.loaded * 100 / event.total);
                        break;
                  case HttpEventType.Response:
    
                  this.fileUp = event.body
                  setTimeout(() => {
                    this.loadingFile = false;
                  }, 1000);
                 
                    return event;
            }
          }),
          tap(message => { }),
          last(),
          catchError((error: HttpErrorResponse) => {
            file.inProgress = false;
            file.canRetry = true;
            return of(`${file.data.name} upload failed.`);
          })
        ).subscribe(
          (event: any) => {

          }
        );
      }
    

    
    fileProgress(fileInput: any, type) {
        this.fileData = <File>fileInput
    
        console.log(fileInput, this.fileData)
        this.preview(type);
    }
      
 
    preview(type) {
      // Show preview 
      var mimeType = this.fileData.type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
    
      var reader = new FileReader();      
      reader.readAsDataURL(this.fileData); 
      reader.onload = (_event) => { 
        

        if(type === 'camp'){

            this.previewUrl = reader.result; 
            this.image = this.previewUrl;

            this.previewLoading = true;

          
        }
        else {

          this.imgProductLoad = true;

          console.log('imgProductLoad ', this.imgProductLoad)
            this.previewUrlEvent = reader.result;
        }
    


      }
    }






  

}



