import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CampaignService } from '../../campaign.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {

  constructor(public matDialogRef: MatDialogRef<SendComponent>,
    private _campaignService: CampaignService,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    ) { }

  ngOnInit() {
  }


  SendInvitation(option){

    console.log(option)

    const invitation = this._data.campaign;

  this._campaignService.getDataPersonForSendEmail(invitation, option)


   

  }



}
