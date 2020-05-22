import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl
} from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { AuthService } from "app/services/authentication/auth.service";
import { first } from "rxjs/operators";

import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
    selector: "login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading: boolean = false;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authServices: AuthService,
        private router: Router,
        private _matSnackBar: MatSnackBar
    ) {
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
        this.loginForm = this._formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: ["", Validators.required]
        });
    }

    login() {
        this.loading = true;

        const email = this.loginForm.get("email");
        const password = this.loginForm.get("password");
        this.authServices
            .login(email.value, password.value)
            .pipe(first())
            .subscribe(
                user => {
                  

                    const urlStatePass = this.authServices.invitedPassStateUrl;


                    this.authServices.defineRolUser(user.user.rol)



                    if(!urlStatePass){

                        this.router.navigate(["/apps/dashboards/analytics"]);
                    }

                    else {
                        this.router.navigate([urlStatePass]);
                    }


                },
                err => {
                    console.log("error api: ", err);
                    this._matSnackBar.open(err.error.message, "OK", {
                        verticalPosition: "top",
                        duration: 3000
                    });

                    this.loading = false;
                }
            );
    }
}
