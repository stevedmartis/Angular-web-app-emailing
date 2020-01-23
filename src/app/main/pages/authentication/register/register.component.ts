import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/services/authentication/auth.service';
import { first } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;
    loading: boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authServices: AuthService,
        private router: Router,
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

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.registerForm = this._formBuilder.group({
            username           : ['', [Validators.required, Validators.minLength(5)]],
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', [Validators.required, Validators.minLength(10)]],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }

    get f() { return this.registerForm.controls; }

    register() {

        this.loading = true;

        const email = this.registerForm.get('email')
        const username = this.registerForm.get('username')
        const password = this.registerForm.get('password')

        this.authServices.register(email.value, username.value, password.value)
        .subscribe(user => {
            console.log('user register and person create:', user)

            this.router.navigate(['/apps/dashboards/analytics']);
        },
        err => {
            console.log('error api: ', err)    
            this._matSnackBar.open(err.error.message, 'OK', {
                verticalPosition: 'top',
                duration        : 3000
            });   
            this.loading = false;
     
           
        })
    }

    
    getMesaggeErrorUsername(){
        return this.f.username.getError('required')? 'Nombre de usuario es requerido' : this.f.username.getError('minlength')? 'Minimo 5 letras' : '';    
      }
    
      getMesaggeErrorPassword(){
        return this.f.password.getError('required')? 'Contraseña es requerida' : this.f.password.getError('minlength')? 'Minimo 10 caracteres' : '';    
      }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {passwordsNotMatching: true};
};


