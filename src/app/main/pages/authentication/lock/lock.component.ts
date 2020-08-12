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
import { ContactsService } from 'app/main/apps/contacts/contacts.service';

@Component({
    selector: "lock",
    templateUrl: "./lock.component.html",
    styleUrls: ["./lock.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LockComponent implements OnInit, OnDestroy {
    invitationForm = this.createInputsForm();
    loading: boolean = false;
    loadingConfirm: boolean = false;
    invited: any;
    objField: any;
    emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
        private router: Router,
       
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
                console.log(invited);


                if (this._formInvitationService.invitedExist) {

                    if(invited.invited){

                       
                    this.invited = invited.invited;

                    console.log(this.invited)

                 
                        if(inputs.length){
                            return


                        }

                        this.getInputsFormInvited(inputs, this.invited);

     

                }

            }

                else {
                    console.log("else ");

                    this.getInputsFormEvent(inputs);
                    
              
                }
            });
    }
    
    capitalize(word){
        return word[0].toUpperCase()+word.slice(1).toLowerCase();
    }


    getInputsFormInvited(inputs, invited) {
        const inputsSelect = this._formInvitationService.arrayInputsSelect;


        let objField = [];
        inputsSelect.forEach((input) => {
            invited.dataImport.forEach((element) => {

                Object.getOwnPropertyNames(element).forEach((val) => {
                    console.log(element)
                    console.log(val, input.nameInitial)
                    if (val === input.nameInitial) {

                      
                        const obj = {
                            title: input.title,
                            name: val,
                            value: element[val],
                            required: input.required,
                            placeHolder: "Ej: " + invited[val],
                        };


                        objField.push(obj);
  
                    }


                });
            });
        });

        console.log(objField)

        objField.forEach(obj => {
    this.patchFieldInputs(obj, inputs);
});



this.loading = true;
       
    }

    getInputsFormEvent(inputs) {
        const inputsSelect = this._formInvitationService.arrayInputsSelect;



        inputsSelect.forEach((input) => {
            console.log(input);
            const obj = {
                title: input.title,
                name: input.nameInitial,
                required: input.required,
                value: "",
                placeHolder: "",
            };

            
            this.patchFieldInputs(obj, inputs);
        });

      
        this.loading = true;
        console.log(inputs);
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



    patchFieldInputs(obj, inputs) {
        inputs.push(this.patchValuesSelection(obj));
    }

    patchValuesSelection(obj) {
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

    getDataInvited(email) {

       

            const inputs = <FormArray>this.f.inputSelection;

         
            if (this.emailPattern.test(email)){

           
                this._formInvitationService
                    .getInvitedByEvent()
                    .then((invited) => {

                    
                          
                            const arrayDataImport = invited.map(obj => {
                                return { dataImport: obj.dataImport, _id: obj._id }

                            }
                           )

                            console.log('arrayDataImport', arrayDataImport)

                            arrayDataImport.forEach(obj => {


                                
                                obj.dataImport.forEach(element => {

                                    
                               

                                Object.keys(element)
                                .forEach((k) => {

                                    
                                    let valueData = element[k];

                                
                                    if(this.emailPattern.test(valueData)){


                                        if(valueData === email){

                                           

                     
                                            Object.getOwnPropertyNames(inputs.value)
                                            .forEach((k) => {

                                               

                                                let value = obj.dataImport[k]

                                      
                                                if(value === k){

                                                    obj.value = k;

                                                    
                                     
                                                }
                                                else {
                                                    return;
                                                }
                                  

                                            })
                                           
                                            console.log('encontrado', obj)

                                            this.invited = obj;

                                            this._formInvitationService.invitedExist = true;

                                            console.log('encontrado', obj,   this._formInvitationService.invitedExist)


                                            this.removeInputs();

                                            this.getInputsFormInvited(inputs, obj)
                  

                 
                                        }

                                        else {
                                            ('no encontrado');

                                           // inputs.reset();

                                            this._formInvitationService.invitedExist = false;
                                        }
                                
                                     }
                
                                })

                            });
             
                            
                 
                
                
                            });
                

                    
                    })
                    .catch((err) => {
                        this._formInvitationService.invitedExist = false;
                    });

                }
            
        }

        removeInputs(){


            while (this.formDataInputs.length > 0) {
              this.formDataInputs.removeAt(0);
            }
          

          
          }


    confirmInvitation() {
        const value = "si";
        this.invitationForm.controls["asiste"].setValue(value);

        const data = this.invitationForm.getRawValue();

        if (this.invitationForm.valid) {

            this.loadingConfirm = true;

            console.log(this._formInvitationService.invitedExist)
            if (this._formInvitationService.invitedExist) {
                let objData = {};

                const dataImport = this.invited.dataImport;

                dataImport.forEach((element) => {
                    Object.getOwnPropertyNames(element).forEach((val) => {
                        objData[val] = element[val];
                    });
                });

                data.inputSelection.forEach((obj) => {
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


            let objInvited = {
                    codeEvento: this._formInvitationService.event._id,
                    asiste: "si",
                    contactado: "email",
                    notes: "se registro con link",
                    emailValid: false,
                    dataImport: [],
                }; 
    
                let obj = {};
    
                console.log(data);
                data.inputSelection.forEach((a1) => {

                    console.log(a1);
                    obj[a1.name] = a1.value?  a1.value : "";
                })
                objInvited.dataImport.push(obj);
    
              
                let arrayValues = [];

            let foundEmail = '';

    
          Object.keys(objInvited.dataImport[0])
            .forEach((val, i) => {

            
                let value = objInvited.dataImport[0][val];
                arrayValues.push(value)
               
                let isData = objInvited.dataImport[0][val]? true : false;

                console.log(value, isData);

    
            })

           // this.validationAndCreate()

           console.log(arrayValues);

           arrayValues.forEach(value => {

                if(value.length){
                    

                    if (this.emailPattern.test(value)) {

                        console.log('is email')

                        foundEmail = value;
                    }
                }
                else {
                    console.log(value)
                }
           });

           console.log('final', foundEmail)

                console.log(objInvited);
    
                if(foundEmail.length){

                    this.validationAndCreate(foundEmail,objInvited )
                   }
        
                   else {
                    this.createContact(objInvited)
                   }


            }
        } else {
            return;
        }
    }

    validationAndCreate(email, objInvited){

        console.log('email', email);
        this._formInvitationService
            .validateEmail(email)
            .then((valid) => {

            
                console.log(valid)
                objInvited.emailValid = valid;
                    this.createContact(objInvited)


            });


}


    createContact(objInvited){
        
        this._formInvitationService
        .addNewInvitation(objInvited)
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
