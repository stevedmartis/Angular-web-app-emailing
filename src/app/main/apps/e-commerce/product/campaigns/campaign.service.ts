import { Injectable, ViewChild, Input } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpRequest,
    HttpEventType,
    HttpErrorResponse
} from "@angular/common/http";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { BehaviorSubject, Observable, Subscription, of } from "rxjs";
import { environment } from "environments/environment";
import { AuthService } from "app/services/authentication/auth.service";
import { EcommerceProductService } from "../product.service";
import { Campaign } from "./campaign.model";
import { ContactsService } from "app/main/apps/contacts/contacts.service";
import { map, tap, last, catchError } from "rxjs/operators";
import { ImgSrcDirective } from "@angular/flex-layout";

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
export class CampaignService {
    routeParams: any;
    campaigns: Campaign[] = [];
    onCampaignChanged: BehaviorSubject<any>;
    onCategoriesChanged: BehaviorSubject<any>;
    userId = this._authServices.currentUserValue.user._id;
    token = this._authServices.currentUserValue.token;
    image: any;
    idEventNow: any;
    base64Image: any;
    loadingCampaigns: boolean = false;

    allLoading: boolean = false;
    selectLoading: boolean = false;
    countStatus = 'Enviar a:'
    value = 0;
    allContacts = this._contactService.contacts.length;
    selectedContacts = this._contactService.selectedContacts.length;
    statusSendInvitation = "";
    invitedFails: any[] = [];

    selectedIndex: number = 0;
    maxNumberOfTabs: number = 3;

    emailsValidForSend: number = 0;

    loadingFile: boolean = false;

    previewUrl: any = null;
    previewLoading: boolean = false;
    previewLoadingEvent: boolean = false;
    value500: 0;
    fileUp: any;
    imgProductLoad: boolean = false;
    eventOpen: boolean = false;

    @Input() text = "Upload";
    @Input() param = "file";
    @Input() target = "https://file.io";

    previewUrlEvent: any;

    private files: Array<FileUploadModel> = [];

    fileData: File = null;
    nameFile: any;

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
    ) {
        // Set the defaults
        this.onCategoriesChanged = new BehaviorSubject({});
        this.onCampaignChanged = new BehaviorSubject({});
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

    getCategories(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/academy-categories")
                .subscribe((response: any) => {
                    this.onCategoriesChanged.next(response);
                    resolve(response);
                }, reject);
        });
    }

    getCampaigns(): Promise<any> {
        this.loadingCampaigns = true;
        return new Promise((resolve, reject) => {
            // console.log('eventId', this.eventId)
            console.log(
                "this._authServices.currentUserValue",
                this._authServices.currentUserValue
            );

            this._httpClient
                .get(environment.apiUrl + "/api/campaign-user/" + this.userId)
                .subscribe((response: any) => {
                    const allCampaigs = response.campaigns;

                    const campByEvent = allCampaigs.filter(
                        x => x.eventId === this._productService.idNowEvent
                    );

                    console.log(
                        "map by id:",
                        this._productService.idNowEvent,
                        campByEvent
                    );

                    this.campaigns = campByEvent;
                    this.onCampaignChanged.next(this.campaigns);

                    this.loadingCampaigns = false;
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Save product
     *
     * @param product
     * @returns {Promise<any>}
     */

    addCampaign(campaign): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/campaign/add-new-campaign", {
                    user: this.userId,
                    codeEvent: this._productService.idNowEvent,
                    affair: campaign.affair,
                    sender: campaign.sender,
                    nameSender: campaign.nameSender,
                    imgBlob: this.previewUrl,
                    footer: campaign.footer,
                    messageConfirm: campaign.messageConfirm,
                    messageCancel: campaign.messageCancel,
                    webLinkCharge: campaign.webLinkCharge,
                    webLink: campaign.webLink,
                    imgTitle: campaign.imgTitle
                })
                .subscribe((response: any) => {
                    this.campaigns.push(response.post);
                    this.onCampaignChanged.next(this.campaigns);

                    resolve(response);
                }, reject);
        });
    }

    deleteCampaign(campaign) {
        console.log(campaign);

        return new Promise((resolve, reject) => {
            this._httpClient
                .delete(
                    environment.apiUrl + "/api/delete-campaign/" + campaign._id
                )
                .subscribe((response: any) => {
                    resolve(response);

                    const campaignIndex = this.campaigns.indexOf(campaign);
                    this.campaigns.splice(campaignIndex, 1);

                    this.onCampaignChanged.next(this.campaigns);

                    console.log(response);
                }, reject);
        });
    }

    editCampaign(campaign): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/campaign/edit", {
                    //user: this.userId,
                    campaignId: campaign.id,
                    affair: campaign.affair,
                    sender: campaign.sender,
                    nameSender: campaign.nameSender,
                    imgBlob: this.previewUrl,
                    messageConfirm: campaign.messageConfirm,
                    messageCancel: campaign.messageCancel,
                    footer: campaign.footer,
                    webLinkCharge: campaign.webLinkCharge,
                    webLink: campaign.webLink,
                    imgTitle: campaign.imgTitle
                })
                .subscribe((response: any) => {
                    resolve(response);
                    console.log(response);

                    this.getCampaigns().then(x => {
                        // this.loadingContact = false;
                    });
                });
        });
    }

    getDataPersonForSendEmail(invitation, option, array) {


        const totalCount = array.length;

        console.log(
            "contacts selects: ",
            this._contactService.selectedContacts
        );

        if (option === "all") {
            this.allLoading = true;

            console.log("allllll");
            const arrayInvitedAll = array;
            const arrayNew = [];
            arrayInvitedAll.forEach(c => {
                if (c.email) {
                    arrayNew.push(c);
                } else {
                    return;
                }
            });


            console.log(arrayNew)

            this.emailsValidForSend = arrayNew.length;
            

           this.invitedArrayforSend(arrayNew, invitation, this.emailsValidForSend);
        } else {
            this.selectLoading = true;



            const arrayInvitedSelected = this._contactService.selectedContacts;

            console.log("allllll");
            
            const arrayNewSelection = [];

            arrayInvitedSelected.forEach(obj => {

                console.log(obj)
               const filter = array.filter(element => element._id === obj);

               console.log(filter)

               if(filter[0].email){

                arrayNewSelection.push(filter[0])

               }

            });

                           
            this.emailsValidForSend = arrayNewSelection.length;

            this.sendSelection(invitation, arrayNewSelection,  this.emailsValidForSend);
           
        }
    }


    getContacts(idEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/invited/event/" + idEvent)
                .subscribe((response: any) => {


                
                    resolve(response);
                }, reject);
        });
    }


    invitedArrayforSend(array, invitation, totalCount) {
        setTimeout(() => {
            array.forEach(obj => {

                this.statusSendInvitation = "Enviando...";

                this.countStatus = "Enviando a: " + totalCount;
               
                console.log(obj)
             
                    if (obj.email) {
                        this.sendInvited(invitation, obj)
                            .then(mail => {

                               
                                this.value++;

                                console.log(mail,  this.value)

                                let id = mail.resBody.Messages[0].To[0].MessageID;
                                   
                                this._contactService.editMessageId(obj._id, id)
                                .then(() => {
                                    this._productService.Is_mailJet()
                                    
                                })
                           

                                if (this.value === totalCount) {
                                    this.value = totalCount;

                                    this.countStatus = "Enviados: " + this.value + " de " + totalCount;

                                    this.statusSendInvitation = "Completado!";
                                }
                            })
                            .catch(err => {
                                this.value++;

                             
          
                                        console.log(err);

                                        this.invitedFails.push(obj);

                                        console.log(this.invitedFails);

                                      
                                

                                if (this.value === totalCount) {
                                    this.value = totalCount;


                                    this.countStatus = "Enviados: " + this.value + " de " + totalCount;


                                    this.statusSendInvitation = "Completado!";

                                }
                            });
                    }
            });
        }, 500);
    }


    sendSelection(invitation, array, totalCount)
    {


        this.countStatus = "Enviando a: " + totalCount;
        this.statusSendInvitation = "Enviando...";
 console.log('' ,array)
        
        setTimeout(() => {
            
            array.forEach(obj => {

                console.log(obj, invitation)

             
                    if (obj.email) {
                        this.sendInvited(invitation, obj)
                            .then(mail => {

                               
                                this.value++;

                                console.log(mail,  this.value)

                                let id = mail.resBody.Messages[0].To[0].MessageID;

                                this._contactService.editMessageId(obj._id, id)
                                .then(() => {
                                    this._productService.Is_mailJet()
                                    
                                })

                                if (this.value === totalCount) {
                                    this.value = totalCount;

                                    this.countStatus = "Enviados: " + this.value + " de " + totalCount;

                                    this.statusSendInvitation = "Completado!";
                                }
                            })
                            .catch(err => {
                                this.value++;

                             
          
                                        console.log(obj);

                                        this.invitedFails.push(obj);

                                        console.log(this.invitedFails);

                                      
                                

                                if (this.value === totalCount) {
                                    this.value = totalCount;

                                    this.countStatus = "Enviados: " + this.value + " de " + totalCount;

                                    this.statusSendInvitation = "Completado!";

                                }
                            });
                    }

                })
         
        }, 500);
    }

    sendInvited(invitation, person): Promise<any> {
        console.log(invitation);
        const imagen = invitation.imgBlob.substr(22);

        const obj = {
            _id: invitation._id,
            affair: invitation.affair,
            nameSender: invitation.nameSender,
            sender: invitation.sender,
            imgBlob: imagen,
            _idInvited: person._id,
            emailInvited: person.email,
            nameInvited: person.name + " " + person.lastname
        };

        return new Promise((resolve, reject) => {
            this._httpClient
                .post<any>(`${environment.apiUrl}/api/send-invited`, obj)
                .subscribe((response: any) => {
                    resolve(response);
                    console.log(response);
                }, reject);
        });
    }

    uploadFile(file: FileUploadModel) {
        this.loadingFile = true;
        const fd = new FormData();
        fd.append(this.param, file.data);

        const req = new HttpRequest("POST", this.target, fd, {
            reportProgress: true
        });

        file.inProgress = true;
        file.sub = this._httpClient
            .request(req)
            .pipe(
                map(event => {
                    switch (event.type) {
                        case HttpEventType.UploadProgress:
                            file.progress = Math.round(
                                (event.loaded * 100) / event.total
                            );
                            break;
                        case HttpEventType.Response:
                            this.fileUp = event.body;
                            setTimeout(() => {
                                this.loadingFile = false;
                            }, 800);

                            return event;
                    }
                }),
                tap(message => {}),
                last(),
                catchError((error: HttpErrorResponse) => {
                    file.inProgress = false;
                    file.canRetry = true;
                    return of(`${file.data.name} upload failed.`);
                })
            )
            .subscribe((event: any) => {});
    }

    fileProgress(fileInput: any, type) {
        this.fileData = <File>fileInput;

        console.log(this.fileData);

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
        reader.onload = _event => {
            if (type === "camp") {
                this.previewUrl = reader.result;

                this.image = this.previewUrl;

                console.log(this.image);

                this.previewLoading = true;
            } else {
                this.imgProductLoad = true;

                this.previewUrlEvent = reader.result;
            }
        };
    }



    mailJetStatusTo(id): Promise<any> {

        console.log('id', id)
        return new Promise((resolve, reject) => {
            this._httpClient
            .get<any>(`${environment.apiUrl}/api/status-to-mailjet/${id}`,)                
            .subscribe((response: any) => {


                    console.log(response);
                    resolve(response);
                   
                }, reject);
        });
    }

    

    
}
