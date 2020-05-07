import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { FormInvitedService } from './form-invited.service';
import { Invited } from './invited.module';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { PolarChartComponent } from '@swimlane/ngx-charts';

@Component({
    selector: "lock",
    templateUrl: "./lock.component.html",
    styleUrls: ["./lock.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LockComponent implements OnInit, OnDestroy {
    invitationForm: FormGroup;

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

                this.invitationForm = this.createInvitedForm();

            });

    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


        createInvitedForm(): FormGroup
    {

        return this._formBuilder.group({
            rut: [this.invited.rut, [Validators.required]],
            invitedId: [this.invited._id],
            name:  [this.invited.name, [Validators.required]], 
            lastname:  [this.invited.lastname, [Validators.required]], 
            email: [this.invited.email, [Validators.required, Validators.email]], 
            company:  [this.invited.company, [Validators.required]], 
            asiste: [],
           // jobtitle: [this.invited.jobtitle, [Validators.required]], 
            phone: [this.invited.phone], 
            contactado: ['email']
        });
    }

    get f() { return this.invitationForm.controls; }

  
    getDataInvited(){

        if(this.f.email.valid){

       

            this._formInvitationService.getInvitedByEmail(this.f.email.value).
            then( (invited) => {
             

                console.log(invited)

                if(invited){

                    this.invited = invited;

                    this._formInvitationService.invitedExist = true;

                    this.invitationForm = this.createInvitedForm();

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
