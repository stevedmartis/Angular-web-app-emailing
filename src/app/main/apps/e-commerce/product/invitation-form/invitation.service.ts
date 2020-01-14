import { Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Invitation } from './invitation.model';
import { EmailEditorComponent } from 'angular-email-editor';

@Injectable()
export class InvitationService 
{
    invitationForm: FormGroup;
    invitation: Invitation;

  
@ViewChild(EmailEditorComponent, {static: true})

private emailEditor: EmailEditorComponent;



     constructor(private _formBuilder: FormBuilder,){


     }


    createInvitationForm(): FormGroup {
        return this._formBuilder.group({
          id: [this.invitation.id],
          name: [this.invitation.name],
          nameField: [{ value: '' ,disabled: true}],
          document: [this.invitation.lastname],
          avatar: [this.invitation.avatar],
          nickname: [this.invitation.nickname],
          company: [this.invitation.company],
          jobtitle: [this.invitation.jobtitle],
          email: [this.invitation.email],
          phone: [this.invitation.phone],
          address: [this.invitation.address],
          birthday: [this.invitation.birthday],
          notes: [this.invitation.notes],
          'editor': new FormControl(null)
        });
      }

      createCampaign(){
        console.log(  this.invitationForm.get('editor').value)
      }
    


  exportHtml() {
    this.emailEditor.exportHtml((data) => console.log('exportHtml', data));
  }

  editorLoaded() {
    // (load)="editorLoaded($event)"
    const json = {}
    this.emailEditor.loadDesign(json)
  }

     
}