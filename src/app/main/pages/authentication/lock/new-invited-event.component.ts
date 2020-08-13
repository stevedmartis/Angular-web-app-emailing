import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";


import { Invited } from './invited.module';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormInvitedNewService } from './form-invited-new.service';
import { Title } from '@angular/platform-browser';




@Component({
    selector: "lock",
    templateUrl: "./new-invited.component.html",
    styleUrls: ["./lock.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewInvitedComponent implements OnInit, OnDestroy {
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
        public _formInvitationNewService: FormInvitedNewService,
        private router: Router,
        private titleService: Title
    ) {

        this.invited = new Invited({});

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

      


        this.setDocTitle(this._formInvitationNewService.event.affair)



    }

    setDocTitle(title: string) {
        this.titleService.setTitle(title);
     }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }



    confirmInvitation(){

       const  value = 'si'
        this.invitationForm.controls['asiste'].setValue(value);


       const data = this.invitationForm.getRawValue();



    
        this._formInvitationNewService.addNewInvitation(data)
        .then( (inv: Invited ) => {

   

           this.router.navigate(['/pages/confirm/si/' + this._formInvitationNewService.campaignInvitation._id + '/' + this.invited._id ])

            
        })

        


    }

    cancelInvitation(){

        const  value = 'no'
        this.invitationForm.controls['asiste'].setValue(value);

        const data = this.invitationForm.getRawValue();

 

        /*
         this._formInvitationService.confirmInvitation(data)
         .then( (inv: Invited ) => {
 
 
             this.router.navigate(['/pages/confirm/no/' + this._formInvitationService.campaignId])
 
             
         })

         */
 

    }
}
