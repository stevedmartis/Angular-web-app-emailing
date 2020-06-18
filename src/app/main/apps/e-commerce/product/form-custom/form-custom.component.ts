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
import { takeUntil, timeoutWith } from "rxjs/operators";

import { fuseAnimations } from "@fuse/animations";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem,
} from "@angular/cdk/drag-drop";

import { FormCustomService } from './services/form-custom.service';

@Component({
    selector: "form-custom",
    templateUrl: "./form-custom.component.html",
    styleUrls: ["./form-custom.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
})
export class FormCustomComponent implements OnInit, OnDestroy {
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
        private _formCustomService: FormCustomService,

    ) {
        // Set the private defaults
        this.inputsEnabledForm = this.createInputsEnabledForm();
        this.inputsSelectionForm = this.createInputSelectionForm();
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

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


            this._formCustomService.addInputFormInEvent(obj)
            .then((res) =>{

                const fields = <FormArray>this._formCustomService.enabledF.fieldsEnabled;

                fields.push(this.patchValuesEnables(res.input, 1));

            })
        

        }


    }

    patchFieldsEnabled(obj) {

    

        const fields = <FormArray>this._formCustomService.enabledF.fieldsEnabled;

  
           fields.push(this.patchValuesEnables(obj, 1));
       
    }

    patchFieldsSelection(obj) {


      
        const fields = <FormArray>this._formCustomService.selectionF.fieldsSelection;

       
        fields.push(this.patchValuesSelection(obj, 2));
    
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
                ? [obj.value]
                : obj.value,
            placeHolder: obj.placeHolder,
            edit: obj.edit,
            type: obj.type,
            coulmn: Ncolumn,
            nameControl: obj.nameControl,
            required: obj.required,
        });
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

            this._formCustomService.editInputFormColumnSelect(event.value.id)
            .then((res) => {

                this._formCustomService.formDataFieldsInputsSelection.controls.push(
                    this.patchValuesSelection(event.value, 2)
                );
    
                
    
                this._formCustomService.formDataFieldsInputs.removeAt(i);

            })

  

        
        }
    }

    deleteInputEvent(i, obj){

        this._formCustomService.formDataFieldsInputs.removeAt(i);

    }

    dropItemSideBarSelectionClose(i, event, name): void {
        this.toggleSidebar(name);

        this._formCustomService.editInputFormColumnEnabled(event.value.id)
        .then((res) => {

            this._formCustomService.formDataFieldsInputsSelection.removeAt(i);

        this._formCustomService.formDataFieldsInputs.controls.push(
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

            this._formCustomService.editInputFormtitle(f)
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

        this._formCustomService.editInputFormRequired(newObj)
        .then((res) => {

            console.log(res)
        })
        .catch((err) => {console.log(err)})

    

    }

    changeClomun(f) {
        const newObj = f.value;

        newObj.required = !f.value.required;

        console.log(newObj);

        this._formCustomService.editInputFormColumnSelect(f.id)
        .then((res) => {

            console.log(res)
        })
        .catch((err) => {console.log(err)})

    

    }

    ngOnDestroy(){

        console.log('desrouu')

        this._formCustomService.idEventNow = ''

        this._formCustomService.onInputsArrayChange.next([])


        console.log('destoy')


       

        this._formCustomService.removeInputs()

  

        
    }
}
