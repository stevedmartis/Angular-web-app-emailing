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

 



    constructor(
        private _fuseSidebarService: FuseSidebarService,
        private _formBuilder: FormBuilder,
        public _formCustomService: FormCustomService,

    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

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

        if (this._formCustomService.inputsEnabledForm.invalid) {
            return;
        } else {


            this._formCustomService.addInputFormInEvent(obj)
            .then((res) =>{

                const fields = <FormArray>this._formCustomService.enabledF.fieldsEnabled;

                fields.push(this._formCustomService.patchValuesEnables(res.input._id, res.input, 1));

            })
        
        }


    }


 

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    toggleSidebarFolded(name): void {
        this._fuseSidebarService.getSidebar(name).toggleFold();
    }

    dropItemSideBarClose(i, event, name): void {
        console.log(this._formCustomService.inputsEnabledForm);

        if (this._formCustomService.inputsEnabledForm.invalid) {
            return;
        } else {
            this.toggleSidebar(name);

            this._formCustomService.editInputFormColumnSelect(event.value.id)
            .then((res) => {

                console.log(event.event)

                this._formCustomService.formDataFieldsInputsSelection.controls.push(
                    this._formCustomService.patchValuesSelection(event.value.id, event.value, 2)
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


        this._formCustomService.formDataFieldsInputs.controls.push(
            this._formCustomService.patchValuesEnables(event.value.id, event.value, 1)

        )

        this._formCustomService.formDataFieldsInputsSelection.removeAt(i);

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



        this._formCustomService.editInputFormRequired(newObj)
        .then((res) => {

            console.log(res)
        })
        .catch((err) => {console.log(err)})

    

    }

    changeClomun(f) {
        const newObj = f.value;



        this._formCustomService.editInputFormColumnSelect(newObj.id)
        .then((res) => {

            console.log(res)
        })
        .catch((err) => {console.log(err)})

    

    }

    ngOnDestroy(){

        console.log('desrouu')

        this._formCustomService.idEventNow = ''

        this._formCustomService.onInputsArrayChange.next([])





       

        this._formCustomService.removeInputs()

  

        
    }
}
