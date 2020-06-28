import { Component, OnInit } from '@angular/core';
import { speedDialFabAnimations } from './speed-dial-fab.animations';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
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

  loadingContact: boolean = false;

  emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  fabButtons = [
    {
      icon: 'cloud_download',
      click: 'exportToXls'
    },
    {
      icon: 'import_contacts',
      click: 'importContacts'
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
    public _contactsService: ContactsService,
    private _matSnackBar: MatSnackBar,
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

              this.loadingContact = true;
          

              let data = response.getRawValue();

              
              this._contactsService.validateEmail(data.email)
              .then((res: any) => {

                
      
                this.newInvitedObj(data, res)

               
              })
              .catch(err => {
    


                this.newInvitedObj(data, err.error.valid)
              })
              


          });
  }

  importContacts(){
    //this._contactsService.excelToJson()
   
  this.onToggleFab()
  
  this._contactsService.xlsxToJson()
 

  }


  conditionCompleteCharge(arrayCount){
    if (this._contactsService.contactsCount === arrayCount) {

      console.log('news ',this._contactsService.contactsCount, "new total", this._contactsService.contacts.length )
    
          this._contactsService.contactsCount = 0;
         
          this.loadingContact = false;
          this._contactsService.editCountInvited(this._contactsService.contacts.length);
          
        this._matSnackBar.open('Carga completada', 'OK', {
          verticalPosition: 'top',
          duration        : undefined
    
      });
  }
  }


  exportToXls(){

    this._contactsService.exportAsExcelFile('bd_turevento');

  }

  onFileChange(ev){

  
    this._contactsService.onFileChange(ev)
    .then((data) => {

    
      console.log('response', data)
    
      this._contactsService.selectFieldsAddInvited(data)
      .then((response) => {
        this.loadingContact = true;
        
      console.log('response', response)


      this._contactsService.addMultipleInvited(response)
      .then((data) => {

      this.loadingContact = false;
      this._contactsService.editCountInvited(this._contactsService.contacts.length);

      this.loadingContact = false;
      
    this._matSnackBar.open('Carga completada', 'OK', {
      verticalPosition: 'top',
      duration        : undefined

  });

})

      })
  


    
    })
  }

  
  

  

  newInvitedObj(data, valid){

    let obj = {
      codeEvento: this._contactsService.idEventNow,
      name: data.name,
      title: data.title,
      lastname: data.lastname,
      email: data.email,
      emailValid: valid,
      address: data.address,
      jobtitle: data.jobtitle,
      company: data.company,
      phone: data.phone,
      asiste: 'null',
      contactado: data.contactado,
      street: data.street,
      city: data.city,
      country: data.country,
      phoneMobil: data.phoneMobil,
      notes: data.notes

  }

  
  this._contactsService.createContact(obj)
  .then(( ) => {

    let newTotal = this._contactsService.contacts.length + 1;

    this._contactsService.editCountInvited(newTotal)
  
    this.loadingContact = false;

    
  })
  .catch( () => {
    this.loadingContact = false;

  });
  }

  newInvitedForDB(data) {


      
  

    return new Promise((resolve, reject) => {

      if(data.email){



  this._contactsService.validateEmail(data.email)
  .then((res) => {


    let obj = {
      codeEvento: this._contactsService.idEventNow,
      name: data.name,
      title: data.title,
      lastname: data.lastname,
      emailValid: res,
      email: data.email,
      address: data.address,
      jobtitle: data.jobtitle,
      company: data.company,
      phone: data.phone,
      asiste: 'null',
      contactado: data.contactado,
      street: data.street,
      city: data.city,
      country: data.country,
      phoneMobil: data.phoneMobil,
      notes: data.notes

  }


  this._contactsService.createContact(obj)
  .then((res) => {

    resolve(res)
  })

  .catch(err => reject)

   
  })

}

else {

  let obj = {
    codeEvento: this._contactsService.idEventNow,
    name: data.name,
    title: data.title,
    lastname: data.lastname,
    emailValid: false,
    email: data.email,
    address: data.address,
    jobtitle: data.jobtitle,
    company: data.company,
    phone: data.phone,
    asiste: 'null',
    contactado: data.contactado,
    street: data.street,
    city: data.city,
    country: data.country,
    phoneMobil: data.phoneMobil,
    notes: data.notes

}


  this._contactsService.createContact(obj)
  .then((res) => {

    resolve(res)
  })

  .catch(err => reject)


}
  })


}

  


  handleClick(method: string) {
    switch (method) {
      case 'newContact':
      this.newContact();
     break;
      case 'importContacts':
      this.importContacts()
     break;
     case 'exportToXls':
     this.exportToXls()
 
   default:
     break;
 }

}

}
