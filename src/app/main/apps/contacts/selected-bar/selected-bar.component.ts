import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactsService } from 'app/main/apps/contacts/contacts.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class ContactsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedContacts: boolean;
    isIndeterminate: boolean;
    selectedContacts: string[];
    btnDisplay: boolean = false
    

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _contactsService: ContactsService,
        public _matDialog: MatDialog
    )
    {
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

        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                this.selectedContacts = selectedContacts;
                setTimeout(() => {
                    this.btnDisplay = true
                    console.log('selectedContacts', selectedContacts)
                    this.hasSelectedContacts = selectedContacts.length > 0;
                    this.isIndeterminate = (selectedContacts.length !== this._contactsService.contacts.length && selectedContacts.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
        this._contactsService.selectContacts();
    }

    selectPage(): void
    {
        this._contactsService.selectContacts();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._contactsService.deselectContacts();
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false,
            panelClass: 'custom-dialog-container'
        });

        if(this._contactsService.selectedContacts.length ===  this._contactsService.contacts.length){
            this.confirmDialogRef.componentInstance.confirmMessage = 'Esta seguro de eliminar todos los invitados?';

        }

        else if (this._contactsService.selectedContacts.length < this._contactsService.contacts.length){
            this.confirmDialogRef.componentInstance.confirmMessage = 'Esta seguro de eliminar la selección?';
        }

     

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {

            
                if ( result )
                {

                    console.log(result, this._contactsService.selectedContacts)

                    if(this._contactsService.selectedContacts.length === this._contactsService.contacts.length){
                        this._contactsService.deleteAllContacts()
                        
                    }

                    else {

                        this._contactsService.loadingContact = true;

                        this._contactsService.selectedContacts.forEach(id => {

                            this._contactsService.countSelect ++
                            this._contactsService.deleteContact(id);
                        });

                        if( this._contactsService.countSelect ===  this._contactsService.selectedContacts.length){

                            this._contactsService.selectedContacts = [];

                            this._contactsService.deselectContacts();

                            this._contactsService.getContacts(this._contactsService.idEventNow);

                            this._contactsService.loadingContact = false;

                        }

                                       

                       
                    }
                 
                    

                }
                this.confirmDialogRef = null;
            });
    }
}
