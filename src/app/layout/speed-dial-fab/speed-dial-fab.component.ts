import { Component, OnInit } from '@angular/core';
import { speedDialFabAnimations } from './speed-dial-fab.animations';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: speedDialFabAnimations
})
export class SpeedDialFabComponent implements OnInit {

  dialogRef: any;
  contactInitial: boolean = false;



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
    public _contactsService: ContactsService
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

      this.onToggleFab()

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

              this._contactsService.loadingContact = true;
             

              let res = response.getRawValue();

              console.log('res', res)

              let obj = {
                  codeEvento: this._contactsService.idEventNow,
                  name: res.name,
                  lastname: res.lastname,
                  email: res.email,
                  //address: res.address,
                  jobtitle: res.jobtitle,
                  company: res.company,
                  phone: res.phone,
                  asiste: 'null',
                  contactado: res.contactado
              }

              console.log('obj ',obj)


              this._contactsService.createContact(obj);


            

          });
  }

  exportContacts(){
    //this._contactsService.excelToJson()
    this.onToggleFab()
  
this._contactsService.xlsxToJson()




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
