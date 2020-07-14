import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, AfterViewInit , ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';
import { Product } from 'app/main/apps/e-commerce/product/product.model';
import { EcommerceProductService } from 'app/main/apps/e-commerce/product/product.service';



import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ContactsComponent } from 'app/main/apps/contacts/contacts.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';

import { CampaignService } from './campaigns/campaign.service';
import { AcademyCoursesService } from '../../academy/courses.service';
import { FormCustomComponent } from './form-custom/form-custom.component';
import { FormCustomService } from './form-custom/services/form-custom.service';

export class FileUploadModel {
    data: File;
    state: string;
    inProgress: boolean;
    progress: number;
    canRetry: boolean;
    canCancel: boolean;
    sub?: Subscription;
    type: string;
  }

  

@Component({
    selector     : 'e-commerce-product',
    templateUrl  : './product.component.html',
    styleUrls    : ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EcommerceProductComponent implements OnInit, OnDestroy
{

    product: Product;
    pageType: string;
    productForm: FormGroup;
    card19: any;
    dialogRef: any;
    isCreated: boolean= false;
    private files: Array<FileUploadModel> = [];
    disabledBtnSave: boolean = true;
    removeTag: boolean = false;
    selectedIndex: number = 0;
    maxNumberOfTabs: number = 3;
    uploadFile: boolean = false;
     


    // Private 
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {EcommerceProductService} _ecommerceProductService
     * @param {FormBuilder} _formBuilder
     * @param {Location} _location
     * @param {MatSnackBar} _matSnackBar
     */
    constructor(
        public _ecommerceProductService: EcommerceProductService,
        public _contactsService: ContactsService,
       
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private _academyCoursesService: AcademyCoursesService,
        public _campaignService: CampaignService,
        private _formCustomService:FormCustomService,

        
        public _matDialog: MatDialog,

    )
    {

        // Set the default
        this.product = new Product();

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
        
        // Subscribe to update product on changes
        this._ecommerceProductService.onProductChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(product => {

                if ( product )
                {

                    this.product = new Product(product.event);

                    this._contactsService.inputsArray =  this.product.inputs;

                    this._contactsService.initColumns = this.product.inputs;


                  

                    this._ecommerceProductService.idNowEvent = product.event._id
                    this.pageType = 'edit';
                    this.isCreated = true;
                    this._campaignService.eventObj = product.event;
                    this._contactsService.idEventNow =  product.event._id;
                  
                    this._contactsService.eventCreated = true;
                    this._campaignService.eventOpen = product.event.active;

                    this._formCustomService.eventExist = true;
                    this._formCustomService.idEventNow = product.event._id;

                   this._formCustomService.getInputsEvent()
                   .then(( inputs) => {
            
                    console.log(inputs)

                    inputs.forEach(obj => {
                        

                        this._formCustomService.getInputsEventOrInitial(obj)

                        

                     
                    });
                  
                   })
                

                  
                   this._contactsService.getContacts(product.event._id)
                    this._campaignService.getCampaigns();
                  

                    this._ecommerceProductService.isNew = false

                    this._ecommerceProductService.getTagsByEvent()
                    .then( (data: any)=> {

                       const x = data.tag.map(obj => obj.name);
                
                        this.product.tags = x;
                        
                    } )
                    this._contactsService.editCountInvited(this._contactsService.contacts.length)

                
                    if(this.product.imgBanner === 'assets/images/banner.jpg'){
                        this._campaignService.imgProductLoad = false;
                    }

                    else {
                        this._campaignService.imgProductLoad = true;
                    }
                    
                }
                else
                {
                    this.pageType = 'new';
                    this.product = new Product();
                    this._formCustomService.eventExist = false

                    this._campaignService.imgProductLoad = false;
                }

                this.productForm = this.createProductForm();

                console.log(this.isCreated)

               this._campaignService.previewUrlEvent = this.product.imgBanner;

             
                
                

            });


             
            
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create product form
     *
     * @returns {FormGroup}
     */
    createProductForm(): FormGroup
    {


        return this._formBuilder.group({
            id              : [this.product._id],
            handle         : [this.product.handle],
            name            : [this.product.eventName],
            company          : [this.product.company],
            description     : [this.product.desc],
            date      : [this.product.dateEvent],
            address      : [this.product.address],
            tags            : [this.product.tags],
            active: [this.product.active],
            img: [ ],
            imgTitle: [{value: this.product.imgTitle, disabled: true}]

        });
    }

    get f() { return this.productForm.controls; }


    /**
     * Save product
     */
    saveProduct(next): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);





            this._ecommerceProductService.deleteAllTags(this.product.tags)
            .then( () => {

                this._ecommerceProductService.saveProduct(data, this._campaignService.previewUrlEvent)
                .then((result) => {
        
                    // Trigger the subscription with new data
                    this._ecommerceProductService.onProductChanged.next(result);
        
        
                    if(next){
                        this.nextStep()

                    }

                    setTimeout(() => {

                                             // Show the success message
                                             this._matSnackBar.open('Evento editado', 'OK', {
                                                verticalPosition: 'top',
                                                duration        : 2000
                                            });
                        
                    }, 600);

                    this.uploadFile = false;
                    this.removeTag = false;
                    
   
        
        
                });

            })






    }

    openContacts() {
        this.dialogRef = this._matDialog.open(ContactsComponent, {
            height: '100%',
            width: '100%',
            data      : {
                idEvent: this.product._id
            }
            

        });
    }



    /**
     * Add product
     */
    addProduct(next): void
    {
        const data = this.productForm.getRawValue();

        
        data.handle = FuseUtils.handleize(data.name);

        console.log(data)

        this._ecommerceProductService.addProduct(data, this._campaignService.previewUrlEvent)
            .then((x) => {
                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(x);

                if(data.tags.length === 0){


        
                    //,  Show the success message
    
    
                    setTimeout(() => {
    
                        this._matSnackBar.open('Evento creado', 'OK', {
                            verticalPosition: 'top',
                            duration        : 3000
                        });
    
                    }, 600);
    
                    this.isCreated = true;
    
                    if(next){
                        this.nextStep()
    
                    }

            
    
                    // Change the location with new one
                    this._location.go('apps/e-commerce/products/' + x.event._id + '/' + x.event.handle);
    
              
    

                }

                else {

           

                this._ecommerceProductService.addTagsInProduct(data.tags)
                .then( () => {


                    setTimeout(() => {
    
                        this._matSnackBar.open('Evento creado', 'OK', {
                            verticalPosition: 'top',
                            duration        : 3000
                        });
    
                    }, 600);
    
                    this.isCreated = true;
    
                    if(next){
                        this.nextStep()
    
                    }
    
                    // Change the location with new one
                    this._location.go('apps/e-commerce/products/' + x.event._id + '/' + x.event.handle);

                    

                })

            }


 
            });
    }


    createEventValidator(control: AbstractControl) {
        if (this.isCreated) {
          return { creationValid: true };
        }
        return null;
      }



      fileUpload(){

        const type = 'prod'
        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        fileUpload.onchange = (event: any) => {
    
    
    
            this._campaignService.fileProgress(event.target.files[0], type )
    
     
    
               const name = event.target.files[0].name
    
            this.f.imgTitle.setValue(name)



             this.product.imgTitle = name;

             if(this.isCreated){

                this.uploadFile = true;

             }

            

        
           // this.uploadFiles();
        }
        fileUpload.click();
        
    }
removeDetected(tag){

    this.product.removeTag(tag)

    this.productForm.controls['tags'].updateValueAndValidity();

    this.removeTag = true;


    

}


nextStep() {
    if (this.selectedIndex !=this.maxNumberOfTabs) {
      this.selectedIndex = this.selectedIndex + 1;
    }
 
  }

  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }
  }

  onClickTab(event){

    if(event.index === 0){
        this.selectedIndex = 0;
    }
    else if(event.index === 1){
        this.selectedIndex = 1;
    }

    else if(event.index === 2){
        this.selectedIndex = 2;
    }

    else if(event.index === 3){
        this.selectedIndex = 3;
    }

  }

  btnNavigateStep(){

   if(this.selectedIndex === 1 || this.selectedIndex === 2 || this.selectedIndex === 3 || this.selectedIndex === 4){

    return true
   }

   else { return false}
  }

  btnNavigateNextStep(){

    if(this.selectedIndex === 0 || this.selectedIndex === 1 || this.selectedIndex === 2){
 
     return true
    }
 
    else { return false}
   }


}
