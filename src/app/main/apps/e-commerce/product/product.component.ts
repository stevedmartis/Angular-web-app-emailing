import { Component, OnDestroy, OnInit, ViewEncapsulation, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';
import { Product } from 'app/main/apps/e-commerce/product/product.model';
import { EcommerceProductService } from 'app/main/apps/e-commerce/product/product.service';
import * as shape from 'd3-shape';


import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ContactsComponent } from 'app/main/apps/contacts/contacts.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { InvitationFormComponent } from './invitation-form/invitation-form.component';
import { InvitationService } from './invitation-form/invitation.service';



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
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    invitationDialogRef: MatDialogRef<InvitationFormComponent>;

    @ViewChild(InvitationFormComponent, {static: true}) invitationComponent: InvitationFormComponent

   
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
        private invitationService: InvitationService,
        
        public _matDialog: MatDialog,




    )
    {
        this.card19 = {
            scheme: {
                domain: ['#5c84f1']
            },
            data  : [
                {
                    name  : 'GOOG',
                    series: [
                        {
                            name : 'Jan 1',
                            value: 540.2
                        },
                        {
                            name : 'Jan 2',
                            value: 539.4
                        },
                        {
                            name : 'Jan 3',
                            value: 538.9
                        },
                        {
                            name : 'Jan 4',
                            value: 539.6
                        },
                        {
                            name : 'Jan 5',
                            value: 540
                        },
                        {
                            name : 'Jan 6',
                            value: 540.2
                        },
                        {
                            name : 'Jan 7',
                            value: 540.48
                        }
                    ]
                }
            ],
            curve : shape.curveBasis
        };
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
                    this.product = new Product(product);
                    this.pageType = 'edit';
                    this.isCreated = true;
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
            name            : [this.product.name],
            company          : [this.product.company],
            description     : [this.product.description],
            date      : [this.product.date],
            tags            : [this.product.tags],
            images          : [this.product.images],

            active          : [this.product.active]
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
            .then(() => {

                // Trigger the subscription with new data
                this._ecommerceProductService.onProductChanged.next(data);

                // Show the success message
                this._matSnackBar.open('Product saved', 'OK', {
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

                this.isCreated = true;
                // Change the location with new one
                this._location.go('apps/e-commerce/products/' + this.product._id + '/' + this.product.handle);
            });
    }

    eventDelete(){


            this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
                disableClose: false,
                panelClass: 'custom-dialog-container'
            });
    
            this.confirmDialogRef.componentInstance.confirmMessage = 'Seguro que desea eliminarlo?';
    
            this.confirmDialogRef.afterClosed().subscribe(result => {
                if ( result )
                {

                    this._ecommerceProductService.deleteEvent(this.product._id)
                    .then(x => {
            
                        this.router.navigate(['apps/e-commerce/products']);
                               
                        this._matSnackBar.open('Evento eliminado', 'OK', {
                            verticalPosition: 'top',
                            duration        : 3000
                        });
                    })
                    
                }
                this.confirmDialogRef = null;
            });
    

    }


    dialogInvitationForm(){

        this.invitationDialogRef = this._matDialog.open(InvitationFormComponent, {
            disableClose: true,
            panelClass: 'invitation-form-dialog',
            height: '100%',
            width: '100%',
            
            data      : {
                contact: '',
                action : 'new'
            }
        });
    
        this.invitationDialogRef.componentInstance.dataproduct = 'inivtacion sexy';
    
        this.invitationDialogRef.afterClosed().subscribe(result => {

            console.log(result)
            if ( result )
            {

                console.log('create invitation!')
                this.invitationService.createCampaign()
            }
    
        })

    }



 
}
