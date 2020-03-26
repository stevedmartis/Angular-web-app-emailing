import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CampaignService } from '../../campaign.service';
import { isThisSecond } from 'date-fns';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit, OnDestroy {

  selectionCount = this._campaignService._contactService.selectedContacts.length;

  allContacts: any[]
  contactsCount: number = 0;
  loadingContacts: boolean = true;

  constructor(public matDialogRef: MatDialogRef<SendComponent>,
    public _campaignService: CampaignService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    ) { }

  ngOnInit() {

    console.log(this._campaignService._contactService.idEventNow)

    
    this._campaignService.getContacts(this._campaignService._contactService.idEventNow)
    .then((x) => {
      this.allContacts = x.invited;



      this.contactsCount = this.allContacts.length;

        this.loadingContacts = false;
    })



 
  }


  allInvitation(option){

if(this.allContacts.length > 0){

  console.log('pasa')

    if(this._campaignService.allLoading){
      return 

  } 
  else {

const initialStatus =  'Cargando...'
    this._campaignService.countStatus = initialStatus

    this._campaignService.statusSendInvitation = initialStatus
    
    const invitation = this._data.campaign;

    this._campaignService.getDataPersonForSendEmail(invitation, option, this.allContacts)


  }
}


}


  SendInvitation(option){

    if(this.selectionCount > 0){


      if(this._campaignService.selectLoading){
        return 

    } 
    else {

      this._campaignService.statusSendInvitation = 'Cargando...'
      
    const invitation = this._data.campaign;

    this._campaignService.getDataPersonForSendEmail(invitation, option,  this.allContacts)


    }



  }
  }

  ngOnDestroy(){

    this._campaignService.allLoading = false;

    this._campaignService.emailsValidForSend = 0;
    this._campaignService.value = 0
    this._campaignService.invitedFails = [];
  

  }


}
