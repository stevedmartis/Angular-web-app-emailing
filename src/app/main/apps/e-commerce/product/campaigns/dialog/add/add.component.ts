import { Component, OnInit, Inject, Output, Input, EventEmitter,} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Campaign } from '../../campaign.model';
import { Subscription, of } from 'rxjs';
import { HttpRequest, HttpEventType, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError, last, tap, map } from 'rxjs/operators';
import { CampaignService } from '../../campaign.service';

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


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

      
  @Input() text = 'Upload';
  @Input() param = 'file';
@Input() target = 'https://file.io';

fileData: File = null

fileUp: any;

@Output() complete = new EventEmitter<string>();
private files: Array<FileUploadModel> = [];

  campaign: Campaign;
  dialogTitle = 'Nueva campañia';
  action: string;
  campaignForm: FormGroup;


  
  
  constructor(
    public matDialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    public _campaignService: CampaignService
    
    ) {
      // Set the defaults

      console.log('_data', _data)
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Editar campaña';
          this.campaign = _data.campaign;


          this._campaignService.previewLoading = true;
          this._campaignService.previewUrl = this.campaign.imgBlob;
      }
      else
      {
          this.dialogTitle = 'Nueva campaña';
          this.campaign = new Campaign({});

          this._campaignService.previewLoading = false;
          this._campaignService.previewUrl = null
      }

      this.campaignForm = this.createCampaignForm();
  }

  ngOnInit() {

  }



  createCampaignForm(): FormGroup
  {

      return this._formBuilder.group({
          id              : [this.campaign._id],
          affair         : [this.campaign.affair],
          imgBlob: [],
          sender            : [this.campaign.sender, [Validators.required, Validators.email]],
          nameSender         : [this.campaign.nameSender],
          messageConfirm: [this.campaign.messageConfirm],
          messageCancel:  [this.campaign.messageCancel],
          footer:              [this.campaign.footer],

  
      });
  }


  fileUpload(){

    const type = 'camp'
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = (event) => {

        for(let index = 0; index < fileUpload.files.length; index++) {
            const file = fileUpload.files[index];


            this._campaignService.fileProgress(file, type )
            this.files.push({
                data: file,
                state: 'in',
                inProgress: false,
                progress: 0,
                canRetry: false,
                canCancel: true,
                type: 'image'
            });
        }
       // this.uploadFiles();
    }
    fileUpload.click();
    
}



}
