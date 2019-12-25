import { Component, OnInit } from '@angular/core';
import { speedDialFabAnimations } from './speed-dial-fab.animations';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';


@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {

  dialogRef: any;



  fabButtons = [
    {
      icon: 'insert_drive_file',
      click: 'exportContacts'
    },
    {
      icon: 'person_add',
      click: 'newContact'
    },

  ];
  buttons = [];
  fabTogglerState = 'inactive';

  constructor(
    private _matDialog: MatDialog,
    private _contactsService: ContactsService
  ) { }

  showItems() {
    this.fabTogglerState = 'active';
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = 'inactive';
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }


  ngOnInit() {
  }

  newContact(): void
  {
      this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
          panelClass: 'contact-form-dialog',
          data      : {
              action: 'new'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if ( !response )
              {
                  return;
              }

              this._contactsService.createContact(this._contactsService.idEventNow, response.getRawValue());
          });
  }

  exportContacts(){
    //this._contactsService.excelToJson()

    let json_obj = this._contactsService.xlsxToJson()

  }



  handleClick(method: string) {
    switch (method) {
      case 'newContact':
      this.newContact();
     break;
      case 'exportContacts':
      this.exportContacts()
     break;
 
   default:
     break;
 }

}

}
