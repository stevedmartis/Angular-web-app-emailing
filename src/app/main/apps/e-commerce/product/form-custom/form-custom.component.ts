import {
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    OnChanges,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from "@angular/cdk/drag-drop";
import { controllers } from "chart.js";
import { EcommerceProductService } from "../product.service";

@Component({
    selector: "form-custom",
    templateUrl: "./form-custom.component.html",
    styleUrls: ["./form-custom.component.scss"],

    animations: fuseAnimations,
})
export class FormCustomComponent implements OnInit {
    selectedChat: any;

    arrayFieldsInitial = [
        {
          
            title: "Nombre",
            placeHolder: "Texto",
            edit: false,
            type: "text",
            column: 1,
            value: "",
            nameControl: "name",
            required: true,
        },
        {
        
            title: "Apellido",
            placeHolder: "Texto",
            edit: false,
            type: "text",
            column: 1,
            value: "",
            nameControl: "lastName",
            required: false,
        },
        {
  
            title: "Titulo",
            placeHolder: "Texto",
            edit: false,
            type: "text",
            column: 1,
            value: "",
            nameControl: "title",
            required: false,
        },
        {
  
            title: "Fecha nacimiento",
            placeHolder: "Date",
            edit: false,
            type: "text",
            column: 1,
            value: "",
            nameControl: "birthday",
            required: false,
        },

        {
  
            title: "Correo electrónico",
            placeHolder: "Texto",
            edit: false,
            type: "email",
            column: 1,
            value: "",
            nameControl: "email",
            required: false,
        },

        {

            title: "Numero Telefónico",
            placeHolder: "Texto",
            edit: false,
            type: "email",
            column: 1,
            value: "",
            nameControl: "email",
            required: false,
        },
    ];

    arrayFieldsEnabled: any[] = [];

    arrayFieldSelection: any[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */

    inputsEnabledForm: FormGroup;
    inputsSelectionForm: FormGroup;

    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _formBuilder: FormBuilder,
        private _ecommerceProductService: EcommerceProductService
    ) {
        // Set the private defaults
        this.inputsEnabledForm = this.createInputsEnabledForm();
        this.inputsSelectionForm = this.createInputSelectionForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._ecommerceProductService.getInputsEvent().then((data) => {
            console.log(data);

            if (data.inputs.length === 0) {

                this._ecommerceProductService.getInputsInitial()
                .then((data) => {

                    if(data.inputs.length === 0){
                        return;
                    }

                    else {

                        data.inputs.forEach((input) => {

                            this._ecommerceProductService
                                .addInputFormInEvent(input)
                                .then((res) => {
                                    this.arrayFieldsEnabled.push(res.input);
        
                                    this.patchFieldsEnabled();
        
                                    this.patchFieldsSelection();
                                });
                        });
                    }



                })


            } else {
                console.log("mas inputs");

                this.pushEnabledInputsAndPatchValues(data.inputs);
            }
        });
    }

        
    getMesaggeErrorTitle(i, title){


        return (<FormArray>this.inputsEnabledForm.get('fieldsEnabled')).controls[i].invalid && title.length === 0? 'Nombre del campo obligatorio' :  (<FormArray>this.inputsEnabledForm.get('fieldsEnabled')).controls[i].invalid && title.length < 3? 'Minimo 3 letras' : '';
        
       // return this.enabledF.fieldsEnabled.getError('required')? 'Titulo debe tener un nombre' : this.formDataFieldsInputs.getError('minlength')? 'Minimo 3 letras' : '';    
      }

    pushEnabledInputsAndPatchValues(data) {
        data.forEach((obj) => {
            this.arrayFieldsEnabled.push(obj);
        });

        console.log(this.arrayFieldsEnabled);

        this.patchFieldsEnabled();

        this.patchFieldsSelection();
    }

    createInputsEnabledForm(): FormGroup {
        return this._formBuilder.group({
            fieldsEnabled: this._formBuilder.array([]),
        });
    }

    createInputSelectionForm(): FormGroup {
        return this._formBuilder.group({
            fieldsSelection: this._formBuilder.array([]),
        });
    }

    patchFieldsEnabled() {
        const fields = <FormArray>this.enabledF.fieldsEnabled;

        this.arrayFieldsEnabled.forEach((x) => {
            var obj = fields.push(this.patchValuesEnables(x, 1));
        });
    }

    patchFieldsSelection() {
        const fields = <FormArray>this.selectionF.fieldsSelection;

        this.arrayFieldSelection.forEach((x) => {
            var obj = fields.push(this.patchValuesSelection(x, 2));
        });
    }

    patchValuesEnables(obj, Ncolumn) {
        return this._formBuilder.group({
            id: obj._id,
            title: [obj.title, [Validators.required, Validators.minLength(3)]],
            value: obj.value,
            placeHolder: obj.placeHolder,
            edit: obj.edit,
            type: obj.type,
            coulmn: Ncolumn,
            nameControl: obj.nameControl,
            required: obj.required,
        });
    }

    patchValuesSelection(obj, Ncolumn) {
        return this._formBuilder.group({
            id: obj._id,
            title: [obj.title, [Validators.required]],
            value: obj.required
                ? [obj.value, [Validators.required]]
                : obj.value,
            placeHolder: obj.placeHolder,
            edit: obj.edit,
            type: obj.type,
            coulmn: Ncolumn,
            nameControl: obj.nameControl,
            required: obj.required,
        });
    }

    get enabledF() {
        return this.inputsEnabledForm.controls;
    }

    get selectionF() {
        return this.inputsSelectionForm.controls;
    }

    get formDataFieldsInputs() {
        return <FormArray>this.enabledF.fieldsEnabled;
    }

    get formDataFieldsInputsSelection() {
        return <FormArray>this.selectionF.fieldsSelection;
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSidebarFolded(name): void {
        this._fuseSidebarService.getSidebar(name).toggleFold();
    }

    dropItemSideBarClose(i, event, name): void {
        console.log(this.inputsEnabledForm);

        if (this.inputsEnabledForm.invalid) {
            return;
        } else {
            this.toggleSidebar(name);

            this.formDataFieldsInputsSelection.controls.push(
                this.patchValuesSelection(event.value, 2)
            );

            this.formDataFieldsInputs.removeAt(i);

            this.saveFormAction();
        }
    }

    dropItemSideBarSelectionClose(i, event, name): void {
        this.toggleSidebar(name);

        this.formDataFieldsInputsSelection.removeAt(i);

        this.formDataFieldsInputs.controls.push(
            this.patchValuesEnables(event.value, 1)
        );

        this.saveFormAction();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.saveFormAction();
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            this.saveFormAction();
        }
    }

    saveFormAction() {
        this._ecommerceProductService.formCustomPristine = true;

        console.log(
            "change form selection",
            this._ecommerceProductService.formCustomPristine
        );
    }

    dropInSelection(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    dblclickMove(itemName: string, ...targets: string[]) {
        this[targets[0]] = [
            ...this[targets[1]].splice(this[targets[1]].indexOf(itemName), 1),
            ...this[targets[0]],
        ];
    }

    changeTitle(f) {
        console.log(f);

        if (f.title.length >= 3) {

            this._ecommerceProductService.editInputFormtitle(f)
            .then((res) => {
    
                console.log(res)
            })
            .catch((err) => {console.log(err)})
         
        } else {
            return;
        }
    }

    changeRequiredSlide(f) {
        const newObj = f.value;

        newObj.required = !f.value.required;

        console.log(newObj);

        this._ecommerceProductService.editInputFormRequired(newObj)
        .then((res) => {

            console.log(res)
        })
        .catch((err) => {console.log(err)})

    

    }
}
