import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CampaignService } from '../../campaign.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  selectionCount = this._campaignService._contactService.selectedContacts.length;

  allContacts: any[]
  contactsCount: number = 0;

  constructor(public matDialogRef: MatDialogRef<SendComponent>,
    public _campaignService: CampaignService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    ) { }

  ngOnInit() {

    console.log(this._campaignService._contactService.idEventNow)

    this._campaignService.getContacts(this._campaignService._contactService.idEventNow)
    .then((x) => {
      this.allContacts = x.invited;

      console.log(this.allContacts)

      this.contactsCount = this.allContacts.length;
    })


   



 
  }


  allInvitation(option){

if(this.allContacts.length > 0){

  console.log('pasa')

    if(this._campaignService.allLoading){
      return 

  } 
  else {

    this._campaignService.statusSendInvitation = 'Cargando...'
    
    const invitation = this._data.campaign;

    this._campaignService.getDataPersonForSendEmail(invitation, option)


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

    this._campaignService.getDataPersonForSendEmail(invitation, option)


    }



  }
  }


}
