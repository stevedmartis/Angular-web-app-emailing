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
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { EmailEditorComponent } from 'angular-email-editor';
import { MatStepper } from '@angular/material';
import { WebsocketService } from 'app/services/websocket.service';


@Component({
    selector     : 'e-commerce-product',
    templateUrl  : './product.component.html',
    styleUrls    : ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class EcommerceProductComponent implements OnInit, OnDestroy
{

    @ViewChild(EmailEditorComponent, {static: false}) emailEditor: EmailEditorComponent
    @ViewChild(MatStepper, {static: false}) stepper;

    product: Product;
    pageType: string;
    productForm: FormGroup;
    card19: any;
    dialogRef: any;
    isCreated: boolean= false;

    //@ViewChild(InvitationFormComponent, {static: false}) invitationComponent: InvitationFormComponent

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
        private _ecommerceProductService: EcommerceProductService,
        public _contactsService: ContactsService,
        private _formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private router: Router,
        private cdRef: ChangeDetectorRef,

        
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

                    console.log('product', product)
                    this.product = new Product(product.event);
                    console.log('this.product', this.product)
                    this.pageType = 'edit';
                    this.isCreated = true;
                    this._contactsService.idEventNow =  product.event._id;
                    this._contactsService.eventCreated = true;
                }
                else
                {
                    this.pageType = 'new';
                    this.product = new Product();
                }

                this.productForm = this.createProductForm();

                console.log(this.isCreated)

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
            tags            : [this.product.tags],
            active: [this.product.active]
        });
    }

    /**
     * Save product
     */
    saveProduct(): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.saveProduct(data)
            .then((result) => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(result);

                // Show the success message
                this._matSnackBar.open('Evento editado', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                });
            });
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
    addProduct(): void
    {
        const data = this.productForm.getRawValue();
        data.handle = FuseUtils.handleize(data.name);

        this._ecommerceProductService.addProduct(data)
            .then((x) => {
                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(x);

                // Show the success message
                this._matSnackBar.open('Evento creado', 'OK', {
                    verticalPosition: 'top',
                    duration        : 3000
                });

                console.log(x)
                this.isCreated = true;


               
                // Change the location with new one
                this._location.go('apps/e-commerce/products/' + x.event._id + '/' + x.event.handle);
            });
    }

    sendEmailToInvited(){
        console.log('contacts ',this._contactsService.contacts)
    }


    createEventValidator(control: AbstractControl) {
        if (this.isCreated) {
          return { creationValid: true };
        }
        return null;
      }


      

}
