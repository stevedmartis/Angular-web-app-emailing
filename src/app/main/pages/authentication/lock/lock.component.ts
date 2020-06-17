import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { FormInvitedService } from './form-invited.service';
import { Invited } from './invited.module';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PolarChartComponent } from '@swimlane/ngx-charts';
import { Title } from '@angular/platform-browser';

@Component({
    selector: "lock",
    templateUrl: "./lock.component.html",
    styleUrls: ["./lock.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LockComponent implements OnInit, OnDestroy {
    invitationForm = this.createInputsForm();;

    invited: Invited;
  

    private _unsubscribeAll: Subject<any>;
   
    
    
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        public _formInvitationService: FormInvitedService,
        private router: Router
    ) {

        this.invited = new Invited();

        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

       
       
       
        
   
        // Subscribe to update product on changes
        this._formInvitationService.onInvitedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(invited => {


                console.log( 'array in onInit ',this._formInvitationService.arrayInputsSelect)

                this.patchFieldInputs()


                console.log('invited', invited)
                if ( !invited.invited)
                {


                    this.invited = new Invited();

                    console.log(  this.invited)

                   
    
                }
                else
                {


                    
                    console.log('invited', invited)
                    this.invited = new Invited(invited.invited);
                    console.log('this.producte.evnd.id',invited.invited._id)
                   
                }

              //  this.invitationForm = this.createInvitedForm();

            });

    }

    

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


    createInputsForm(): FormGroup
    {

        return this._formBuilder.group({
            //rut: [this.invited.rut, [Validators.required]],
            //invitedId: [this.invited._id],
            //name:  [this.invited.name, [Validators.required]], 
            //lastname:  [this.invited.lastname, [Validators.required]], 
            //email: [this.invited.email, [Validators.required, Validators.email]], 
            //company:  [this.invited.company, [Validators.required]], 
           asiste: [],
           // jobtitle: [this.invited.jobtitle, [Validators.required]], 
            //phone: [this.invited.phone], 
            //contactado: ['email']
            inputSelection: this._formBuilder.array([])
        });
    }

    get f() { return this.invitationForm.controls; }

    get formDataInputs(){
        return <FormArray>this.f.inputSelection;
    }


    getMesaggeErrorTitle(i, title, value){


        return (<FormArray>this.invitationForm.get('inputSelection'))
        .controls[i].invalid && value.length === 0? 
        title + ' es obligatorio' : ''
        
       // return this.enabledF.fieldsEnabled.getError('required')? 'Titulo debe tener un nombre' : this.formDataFieldsInputs.getError('minlength')? 'Minimo 3 letras' : '';    
      }

    patchFieldInputs() {
        const inputs = <FormArray>this.f.inputSelection;

        this._formInvitationService.arrayInputsSelect.forEach((x) =>  {
            inputs.push(this.patchValiesSelection(x))

            console.log(inputs)
        })

     
    }

    patchValiesSelection(obj){
        return this._formBuilder.group({
            id: obj._id,
            title: [obj.title],
            value: obj.required
                ?  [obj.value, [Validators.required]]
                : obj.value,
            placeHolder: obj.placeHolder,
            edit: obj.edit,
            type: obj.type,
            coulmn: obj.column,
            nameControl: obj.nameControl,
            required: obj.required,
        })
    }

  
    getDataInvited(){

        

        const findEmail = this._formInvitationService.arrayInputsSelect.filter(x => {
            return x.type === 'email'? true: false;
        })

    console.log(findEmail)

        if(findEmail.length === 0){

            return
        }

        else {

     

        if(this.f.email.valid){

       

            this._formInvitationService.getInvitedByEmail(this.f.email.value).
            then( (invited) => {
             

                console.log(invited)

                if(invited){

                    this.invited = invited;

                    this._formInvitationService.invitedExist = true;

                 //   this.invitationForm = this.createInvitedForm();

                }

                else {

                    this.invitationForm.controls['invitedId'].setValue('');

                    this._formInvitationService.invitedExist = false;

                 

                }


            })
            .catch(err => {

                this._formInvitationService.invitedExist = false;

            })
        

    }

}

    }


    confirmInvitation(){


        
        const  value = 'si';
        this.invitationForm.controls['asiste'].setValue(value);
 
 
        const data = this.invitationForm.getRawValue()
      
console.log('data', data)
        if(this.invitationForm.valid){

            console.log('valid!: ')

            if(this._formInvitationService.invitedExist){


 
        console.log('invited data: ', data)
 
         this._formInvitationService.confirmInvitation(data)
         .then( (inv: Invited ) => {
 
             console.log(inv)
 
             this.router.navigate(['/pages/confirm/si/' + this._formInvitationService.campaignId + '/' + this.invited._id])
 
         })
            
        
        }

        else {

            console.log('hi', data)



            this._formInvitationService.addNewInvitation(data)
            .then((res) => {

                let inv = res.post;

                console.log(inv)
                this.router.navigate(['/pages/confirm/si/' + this._formInvitationService.campaignId + '/' + inv._id])
            })


        }

    }

    else {
        return;
    }
    }

    cancelInvitation(){

        const  value = 'no'
        this.invitationForm.controls['asiste'].setValue(value);

        const data = this.invitationForm.getRawValue();

        console.log('invited data: ', data)
 
         this._formInvitationService.confirmInvitation(data)
         .then( (inv: Invited ) => {
 
             console.log(inv)
 
             this.router.navigate(['/pages/confirm/no/' + this._formInvitationService.campaignId])
 
             
         })
 

    }
}
