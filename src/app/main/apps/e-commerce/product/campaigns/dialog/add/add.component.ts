import { Component, OnInit, Inject, Output, Input, EventEmitter,} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Campaign } from '../../campaign.model';
import { Subscription, of } from 'rxjs';
import { HttpRequest, HttpEventType, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { catchError, last, tap, map } from 'rxjs/operators';


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
  loadingFile: boolean = false; 

    
  previewUrl:any = null;
  previewLoading: boolean = false;

  
  
  constructor(
    public matDialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    
    ) {
      // Set the defaults

      console.log('_data', _data)
      this.action = _data.action;

      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'Editar campañia';
          this.campaign = _data.contact;
      }
      else
      {
          this.dialogTitle = 'Nueva campañia';
          this.campaign = new Campaign({});
      }

      this.campaignForm = this.createCampaignForm();
  }

  ngOnInit() {

  }



  createCampaignForm(): FormGroup
  {

      return this._formBuilder.group({
          id              : [this.campaign.id],
          asunto         : [this.campaign.asunto],
          remitente            : [this.campaign.remite],
          notes:              [this.campaign.footer]
  
      });
  }

  fileUpload(){
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = (event) => {

      console.log(event, fileUpload)
        for(let index = 0; index < fileUpload.files.length; index++) {
            const file = fileUpload.files[index];

            console.log('file', file)

            this.fileProgress(file)
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
        this.uploadFiles();
    }
    fileUpload.click();
    
}


private uploadFile(file: FileUploadModel) {
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
        if (typeof (event) === 'object') {
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
        }
      }
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
        console.log('file: ',file)

        this.preview()
      this.uploadFile(file);
    });
  }


fileProgress(fileInput: any) {
    this.fileData = <File>fileInput

    console.log(fileInput, this.fileData)
    this.preview();
}
  




preview() {
  // Show preview 
  var mimeType = this.fileData.type;
  if (mimeType.match(/image\/*/) == null) {
    return;
  }

  var reader = new FileReader();      
  reader.readAsDataURL(this.fileData); 
  reader.onload = (_event) => { 
    this.previewUrl = reader.result; 

    console.log('this.previewUrl ', this.previewUrl)
    this.previewLoading = true;
  }
}
  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);

    if (index > -1) {
      this.files.splice(index, 1);
    }
  }


}
