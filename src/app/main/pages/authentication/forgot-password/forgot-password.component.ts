import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ForgotPasswordService } from './forgot-password.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector     : 'forgot-password',
    templateUrl  : './forgot-password.component.html',
    styleUrls    : ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;
    emailSend: boolean = false;
    email: any;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _forgotService: ForgotPasswordService,
        private _matSnackBar: MatSnackBar
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
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
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    get f() { return this.forgotPasswordForm.controls; }

    forgotPassword() {

        let email = this.f.email.value;

        console.log(email)
       this._forgotService.forgotPassword(email)
       .subscribe(data => {
           console.log(data)

           if(data.user.length === 0){
            this._matSnackBar.open('Email no existe', 'OK', {
                verticalPosition: 'top',
                duration        : 2000
            }); 
           }
           else {
               console.log('ok', data.user[0].email)


               this._forgotService.sendMailJet(data.user[0].email, data.user[0].username)
               .subscribe(res => {
                    console.log(res)

                    this.email = data.user[0].email;
                    this.emailSend = true;
               })
           }
       },
       err => {
        console.log('error api: ', err)    
        this._matSnackBar.open(err.message, 'OK', {
            verticalPosition: 'top',
            duration        : 2000
        });        
       
    })
    }
}
