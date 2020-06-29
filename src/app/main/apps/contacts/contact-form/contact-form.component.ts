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


        
        this.contactForm = this.createContactForm()
        
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


        console.log('divider',arrayFirstHalf,
        arraySecondHalf)

        const obj = {
            arrayFirstHalf,
            arraySecondHalf
        }

        let dividerArray = obj

        console.log('dividerArray', dividerArray)
        resolve(dividerArray)

    })

    }
         
getInputsFormInvited(inputsForm, inputsForm2){

  const inputs =  this._contactServices.arraySelect;

  console.log(inputs, this.contact)

  const objField = [];


  
  if(inputs.length > 0 ){

  inputs.forEach(f => {


    const obj = {

        title:  f.name,
        value:  this.contact[f.name],
        placeHolder: 'Ej: ' +  this.contact[f.name]
    }

    objField.push(obj)
      
  });

  console.log(objField)
 

        this.dividerArrayInputs(objField)
        .then((array) => {

            console.log('them array:', inputs)

            this.arrayDividerArrayPatch(array.arrayFirstHalf, inputsForm)

            this.arrayDividerArrayPatch(array.arraySecondHalf, inputsForm2)

        })

  
      }


  }


  arrayDividerArrayPatch(array, inputsForm){

    array.forEach(obj => {
  
        inputsForm.push(this.patchValuesInput(obj))
        
      });

      console.log(this.f)

      this.loadInputs = true;


  }

  addInputsForm(inputsForm, inputsForm2){
        
        console.log('event not inpuits')
  
        this._contactServices.getInputsEvent()
        .then((array) => {


            this.dividerArrayInputs(array)
            .then((array) => {
    
                console.log('them array:', array)
    
                this.arrayDividerArrayPatch(array.arrayFirstHalf, inputsForm)

                this.arrayDividerArrayPatch(array.arraySecondHalf, inputsForm2)
    
            })

        })
  
       
      
  }
  
  patchValuesInput(obj) {

    
    return this._formBuilder.group({

        title: obj.title,
        value: obj.value,
        placeHolder: obj.placeHolder,
    });
  }

  


}
