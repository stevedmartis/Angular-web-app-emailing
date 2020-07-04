import { Component, Inject, ViewEncapsulation,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Contact } from 'app/main/apps/contacts/contact.model';
import { ContactsService } from '../contacts.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'contacts-contact-form-dialog',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ContactsContactFormDialogComponent implements OnInit {
    action: string;
    contact: Contact;
  
    dialogTitle: string;
    checked = true;
    edit: boolean  = false;

 
    private _unsubscribeAll: Subject<any>;

    contactForm: FormGroup
    loadInputs: boolean = false;



    contactOptions: any[] = [
        {value: 'null', name: 'No contactado'},
        {value: 'phone', name: 'Por teléfono'},
        {value: 'email', name: 'Por email'}


    ]

    asisteOptions: any[] = [
        { value: 'null', name: 'En proceso' },
        { value: 'si', name: 'Confirmado' },
        { value: 'no', name: 'Cancelado' }


    ]
    /**
     * Constructor
     * 
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        public _contactServices: ContactsService,
        private _formBuilder: FormBuilder,
        
    
    ) {
        // Set the defaults
        this.action = _data.action;


        

        if (this.action === 'edit') {
            this.dialogTitle = 'Editar invitado';

            this.edit = true
            this.contact = _data.contact;

            

         

        

            console.log( this.contact)

        
        }
        else {
            this.dialogTitle = 'Nuevo Invitado';
            this.contact = new Contact({});




           
        }

   

     

        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */


     ngOnInit(){
        
        this.contactForm = this.createContactForm();
        
        const inputsForm = <FormArray>this.f.inputsFormContact;

        const inputsForm2 = <FormArray>this.f.inputsFormContact2;

        this.getInputsFormInvited(inputsForm, inputsForm2)

  

     }


     createContactForm():FormGroup {
        return this._formBuilder.group({
            id: [this.contact._id],
            contactado: [this.contact.contactado],
            asiste: [this.contact.asiste],
            notes: [this.contact.notes],
            inputsFormContact: this._formBuilder.array([]),
            inputsFormContact2: this._formBuilder.array([]),
        });
    }

    get f() {
        return this.contactForm.controls;
    }

    get formDataInputs() {
        return <FormArray>this.f.inputsFormContact;
    }

    get formDataInputs2() {
        return <FormArray>this.f.inputsFormContact2;
    }


    dividerArrayInputs(array): Promise<any>{

        console.log(array)

        
        return new Promise((resolve, reject) => {

      
        let halfwayThrough = Math.floor(array.length / 2)

        let arrayFirstHalf = array.slice(0, halfwayThrough);
        let arraySecondHalf = array.slice(halfwayThrough, array.length);


        const obj = {
            arrayFirstHalf,
            arraySecondHalf
        }

        let dividerArray = obj


        resolve(dividerArray)

    })

    }
         
getInputsFormInvited(inputsForm, inputsForm2){

  const inputs =  this._contactServices.inputsArray.filter(obj => obj.export)



let objField = []; 
  
if( this.contact.dataImport.length === 0){


    
      objField = inputs;
    
    

}

else {

    this.contact.dataImport.forEach(element => {

    
    Object.getOwnPropertyNames(element)
    .forEach((val) => {

      

  const title = this.capitalize(val)

  const obj = {
      title:  title,
      name: val,
      value:  element[val],
      placeHolder: 'Ej: ' +  this.contact[val]
  }

  objField.push(obj)




});

});

}

        this.dividerArrayInputs(objField)
        .then((array) => {


            this.arrayDividerArrayPatch(array.arrayFirstHalf, inputsForm)

            this.arrayDividerArrayPatch(array.arraySecondHalf, inputsForm2)

        })

  
    


  }

  capitalize(word){
    return word[0].toUpperCase()+word.slice(1).toLowerCase();
}



  arrayDividerArrayPatch(array, inputsForm){

    array.forEach(obj => {
  
        inputsForm.push(this.patchValuesInput(obj))
        
      });



      this.loadInputs = true;


  }

  addInputsForm(inputsForm, inputsForm2){
     
  
        this._contactServices.getInputsEvent()
        .then((array) => {


            this.dividerArrayInputs(array)
            .then((array) => {
    
    
                this.arrayDividerArrayPatch(array.arrayFirstHalf, inputsForm)

                this.arrayDividerArrayPatch(array.arraySecondHalf, inputsForm2)
    
            })

        })
  
      
  }
  
  patchValuesInput(obj) {

    
    return this._formBuilder.group({

        title: obj.title,
        name: obj.name,
        value: obj.value,
        placeHolder: obj.placeHolder,
    });
  }

  
}
