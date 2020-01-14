import { Component, OnInit, Inject, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Invitation } from './invitation.model';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Subscription, of } from 'rxjs';
import { catchError, last, tap, map } from 'rxjs/operators';
import { InvitationService } from './invitation.service';


export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}


@Component({
  selector: 'app-invitation-form',
  templateUrl: './invitation-form.component.html',
  styleUrls: ['./invitation-form.component.scss']
})
export class InvitationFormComponent implements OnInit {

  public dataproduct: any;
  invitation: Invitation;
  action: string;
  dialogTitle: string;
  nameFile: any;

  @Input() text = 'Upload';
  @Input() param = 'file';
  @Input() target = 'https://file.io';
  @Input() accept = 'text/*';
  // tslint:disable-next-line:no-output-native
  @Output() complete = new EventEmitter<string>();
  fileInformation: any;
  fileUp: any;
  private files: Array<FileUploadModel> = [];
  loadingFile: boolean = false;


  options: {
    locale: 'es-ES'
  }

  constructor(
    public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _http: HttpClient,
    public _invitationService: InvitationService


  ) {



    // Set the defaults
    this.action = _data.action;



    if (this.action === 'edit') {
      this.dialogTitle = 'Editar Campaña';
      this._invitationService.invitation = _data.contact;
    }
    else {
      this.dialogTitle = 'Nueva campaña';
      this._invitationService.invitation = new Invitation({});

      console.log(this.invitation)
    }

    this._invitationService.invitationForm = this._invitationService.createInvitationForm();
  }

  ngOnInit() {

  }



  fileUpload() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;

    fileUpload.onchange = () => {

      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({
          data: file,
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true
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
    file.sub = this._http.request(req).pipe(
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

      console.log('file: ', file)
      this.uploadFile(file);

      this.nameFile = file.data.name;

      this._invitationService.invitationForm.get('nameField').setValue(this.nameFile);
    });
  }


  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);

    if (index > -1) {
      this.files.splice(index, 1);
    }
  }



}
