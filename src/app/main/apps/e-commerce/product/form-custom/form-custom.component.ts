import {
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    ViewChild,
    OnChanges,
    ElementRef,
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
 
    ];
    arrayFieldsAll: any[] = [];

    arrayFieldsEnabled: any[] = [];

    arrayFieldSelection: any[] = [];

    // Private
    private _unsubscribeAll: Subject<any>;

    @ViewChild("title", {static : true}) titleField: ElementRef;

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
                                    this.arrayFieldsAll.push(res.input);

                                });
                        });

                        console.log('array?', this.arrayFieldsAll)
                        
                        this.pushInputsAndPatchValues();
                    }



                })


            } else {
           

                this.arrayFieldsAll = data.inputs;

                console.log("mas inputs",  this.arrayFieldsAll);

                this.pushInputsAndPatchValues();
            }
        });
    }

        
    getMesaggeErrorTitle(i, title){


        return (<FormArray>this.inputsEnabledForm.get('fieldsEnabled')).controls[i].invalid && title.length === 0? 'Nombre del campo obligatorio' :  (<FormArray>this.inputsEnabledForm.get('fieldsEnabled')).controls[i].invalid && title.length < 3? 'Minimo 3 letras' : '';
        
       // return this.enabledF.fieldsEnabled.getError('required')? 'Titulo debe tener un nombre' : this.formDataFieldsInputs.getError('minlength')? 'Minimo 3 letras' : '';    
      }

    pushInputsAndPatchValues() {


        const enableds = this.arrayFieldsAll.filter(x => {
            return x.column === 1
        } )

        console.log(enableds)

        this.arrayFieldsEnabled = enableds;

    
        const selection =  this.arrayFieldsAll.filter(x => {
           return  x.column == 2   
        } )

        this.arrayFieldSelection = selection;


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

    addNewInput(){
        


        const obj = {
            
  
                title: "Texto",
                placeHolder: "Texto",
                edit: false,
                type: "text",
                column: 1,
                value: "",
                nameControl: "text",
                required: false,
            
        }

        if (this.inputsEnabledForm.invalid) {
            return;
        } else {


            this._ecommerceProductService.addInputFormInEvent(obj)
            .then((res) =>{

                const fields = <FormArray>this.enabledF.fieldsEnabled;

                fields.push(this.patchValuesEnables(res.input, 1));

            })
            

    
             
  

        }


    }

    patchFieldsEnabled() {

        console.log(  this.arrayFieldsEnabled)

        const fields = <FormArray>this.enabledF.fieldsEnabled;

        this.arrayFieldsEnabled.forEach((x) => {
            var obj = fields.push(this.patchValuesEnables(x, 1));
        });
    }

    patchFieldsSelection() {


        console.log(  this.arrayFieldSelection)
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

            this._ecommerceProductService.editInputFormColumnSelect(event.value.id)
            .then((res) => {

                this.formDataFieldsInputsSelection.controls.push(
                    this.patchValuesSelection(event.value, 2)
                );
    
                
    
                this.formDataFieldsInputs.removeAt(i);

            })

  

        
        }
    }

    deleteInputEvent(i, obj){

        this.formDataFieldsInputs.removeAt(i);

    }

    dropItemSideBarSelectionClose(i, event, name): void {
        this.toggleSidebar(name);

        this._ecommerceProductService.editInputFormColumnEnabled(event.value.id)
        .then((res) => {

            this.formDataFieldsInputsSelection.removeAt(i);

        this.formDataFieldsInputs.controls.push(
            this.patchValuesEnables(event.value, 1)

        )

        })



     
    }

    drop(event: CdkDragDrop<string[]>) {
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

    changeClomun(f) {
        const newObj = f.value;

        newObj.required = !f.value.required;

        console.log(newObj);

        this._ecommerceProductService.editInputFormColumnSelect(f.id)
        .then((res) => {

            console.log(res)
        })
        .catch((err) => {console.log(err)})

    

    }
}
