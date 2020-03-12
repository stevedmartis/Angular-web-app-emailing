
import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { InvitationQrScanService } from './invitation-qr-scan.service';
import { Invited } from '../invited.module';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'lock',
  templateUrl: './invitation-qr-scan.component.html',
  styleUrls: ['./invitation-qr-scan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class InvitationQrScanComponent implements OnInit, OnDestroy {
    invitationForm: FormGroup;

    invited: Invited;
    assit_checked: boolean = false;
  

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
        public _formInvitationService: InvitationQrScanService,
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
            invitedId: [this.invited._id, [Validators.required]], 
            name:  [this.invited.name, [Validators.required]], 
            lastname:  [this.invited.lastname, [Validators.required]], 
            email: [this.invited.email, [Validators.required, Validators.email]], 
            company:  [this.invited.company, [Validators.required]], 
            asiste: [],
            jobtitle: [this.invited.jobtitle, [Validators.required]], 
            phone: [this.invited.phone], 
            contactado: ['email']
        });
    }


    confirmInvitation(){

       const  value = 'si'
        this.invitationForm.controls['asiste'].setValue(value);


       const data = this.invitationForm.getRawValue();

       console.log('invited data: ', data)


        this._formInvitationService.assistCheced(data)
        .then( (inv: Invited ) => {

            console.log(inv)


            //this.router.navigate(['/pages/confirm/si/' + this._formInvitationService.campaignId + '/' + this.invited._id])

            this.assit_checked = true;
        })


    }


}


