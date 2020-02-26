import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { FormInvitedService } from './form-invited.service';
import { Invited } from './invited.module';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';

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
        public _formInvitationService: FormInvitedService
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
                if ( invited )
                {

                    console.log('invited', invited)
                    this.invited = new Invited(invited.invited);
                    console.log('this.producte.evnd.id',invited.invited._id)

    
                }
                else
                {

                    this.invited = new Invited();

                    console.log(  this.invited)
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
            id: [this.invited._id, [Validators.required]], 
            name:  [this.invited.name, [Validators.required]], 
            email: [this.invited.email, [Validators.required, Validators.email]], 
            company:  [this.invited.company, [Validators.required]], 

            cargo: [this.invited.jobtitle, [Validators.required]], 
            numberMobil: [this.invited.phone], 
            numberFijo: [''], 
        });
    }
}
