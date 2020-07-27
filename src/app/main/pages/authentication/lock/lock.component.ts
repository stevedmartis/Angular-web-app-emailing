import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";

import { FuseConfigService } from "@fuse/services/config.service";
import { fuseAnimations } from "@fuse/animations";
import { FormInvitedService } from "./form-invited.service";
import { Invited } from "./invited.module";
import { takeUntil } from "rxjs/operators";

import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { PolarChartComponent } from "@swimlane/ngx-charts";
import { Title } from "@angular/platform-browser";

@Component({
    selector: "lock",
    templateUrl: "./lock.component.html",
    styleUrls: ["./lock.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LockComponent implements OnInit, OnDestroy {
    invitationForm 
    = this.createInputsForm()

    invited: any;
    objField: any

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
        

        this._unsubscribeAll = new Subject();
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                toolbar: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                sidepanel: {
                    hidden: true,
                },
            },
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        const inputs = <FormArray>this.f.inputSelection;
        // Subscribe to update product on changes
        this._formInvitationService.onInvitedChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((invited) => {

                console.log(invited)
              

                if (invited.invited) {
                    this.invited = invited.invited;


       
if(this._formInvitationService.arrayInputsSelect.length === 0){
                
    return;
}

else {


    this.getInputsFormInvited(inputs);
}

               
       
            }


        

            if(!this._formInvitationService.invitedExist){
                console.log('else ')

            
            this.getInputsFormEvent(inputs)
        }
    })

}


    getInputsFormInvited(inputs){

        const inputsSelect =   this._formInvitationService.arrayInputsSelect;

        let objField = []; 
        inputsSelect.forEach(input => {
            
     
      
      

      
          this.invited.dataImport.forEach(element => {
      
          
          Object.getOwnPropertyNames( element)
          .forEach((val) => {

              if(val === input.nameInitial){


        
      
        const obj = {
            title:  input.title,
            name: val,
            value:  element[val],
            placeHolder: 'Ej: ' +  this.invited[val]
        }
      
        objField.push(obj)
      
      
    }
      
      
      });
      
      });
      
    });

  


    this.patchFieldInputs(objField, inputs);
          
      
      
        }

        getInputsFormEvent(inputs){

            const inputsSelect =   this._formInvitationService.arrayInputsSelect;

            console.log(inputsSelect)
    
            let objField = []; 
            inputsSelect.forEach(input => {
                console.log(input)
            const obj = {
                title:  input.title,
                name: input.nameInitial,
                value:  '',
                placeHolder: ''
            }
          
            objField.push(obj)

           

            this.patchFieldInputs(objField, inputs);
              
        })

       

        console.log(inputs)

    }
 
      

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        this._formInvitationService.arrayInputsSelect = [];
    }

    createInputsForm(): FormGroup {
        return this._formBuilder.group({
           
            asiste: [],

            inputSelection: this._formBuilder.array([]),
        });
    }

    get f() {
        return this.invitationForm.controls;
    }

    get formDataInputs() {
        return <FormArray>this.f.inputSelection;
    }

    getMesaggeErrorTitle(i, title, value) {
        return (<FormArray>this.invitationForm.get("inputSelection")).controls[
            i
        ].invalid && value.length === 0
            ? title + " es obligatorio"
            : "";
    }

    patchFieldInputs(objField, inputs ) {
     
      
        objField.forEach((x) => {

            console.log(x)
            inputs.push(this.patchValiesSelection(x));

        });
    }

    patchValiesSelection(obj) {
        return this._formBuilder.group({
            id: obj._id,
            title: [obj.title],
            value: obj.required
                ? [obj.value, [Validators.required]]
                : obj.value,
            placeHolder: obj.placeHolder,
            edit: obj.edit,
            type: obj.type,
            coulmn: obj.column,
            name: obj.name,
            required: obj.required,
        });
    }

    getDataInvited() {
        const findEmail = this._formInvitationService.arrayInputsSelect.filter(
            (x) => {
               console.log(x)
            }
        );

        if (findEmail.length === 0) {
            return;
        } else {
            if (this.f.email.valid) {
                this._formInvitationService
                    .getInvitedByEmail(this.f.email.value)
                    .then((invited) => {
                  
                        if (invited) {
                            this.invited = invited;

                            this._formInvitationService.invitedExist = true;

                            //   this.invitationForm = this.createInvitedForm();
                        } else {
                            this.invitationForm.controls["invitedId"].setValue(
                                ""
                            );

                            this._formInvitationService.invitedExist = false;
                        }
                    })
                    .catch((err) => {
                        this._formInvitationService.invitedExist = false;
                    });
            }
        }
    }

    confirmInvitation() {
        const value = "si";
        this.invitationForm.controls["asiste"].setValue(value);

        const data = this.invitationForm.getRawValue();

        if (this.invitationForm.valid) {
          

            if (this._formInvitationService.invitedExist) {




      let objData = {}



          const dataImport = this.invited.dataImport;

    

        dataImport.forEach(element => {
      
          
          Object.getOwnPropertyNames( element)
          .forEach((val) => {

        
      
        objData[val] = element[val];
      

      
      
      });
      
   

      
    });

 data.inputSelection.forEach(obj => {

    objData[obj.name] = obj.value;
 });


                this._formInvitationService
                    .confirmInvitation(this.invited._id, objData)
                    .then((inv: Invited) => {
                    

                        this.router.navigate([
                            "/pages/confirm/si/" +
                                this._formInvitationService.campaignId +
                                "/" +
                                this.invited._id,
                        ]);
                    });
            } else {
            



                this._formInvitationService
                    .addNewInvitation(data)
                    .then((res) => {
                        let inv = res.post;

                 
                        this.router.navigate([
                            "/pages/confirm/si/" +
                                this._formInvitationService.campaignId +
                                "/" +
                                inv._id,
                        ]);
                    });
            }
        } else {
            return;
        }
    }



    cancelInvitation() {
        const value = "no";
        this.invitationForm.controls["asiste"].setValue(value);

        const data = this.invitationForm.getRawValue();

 

        this._formInvitationService
            .confirmInvitation(data, data)
            .then((inv: Invited) => {
                console.log(inv);

                this.router.navigate([
                    "/pages/confirm/no/" +
                        this._formInvitationService.campaignId,
                ]);
            });
    }
}
