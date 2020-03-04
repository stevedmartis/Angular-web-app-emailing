import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs/operators';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { MatPaginator } from '@angular/material/paginator';
import { FuseUtils } from '@fuse/utils';
import {ChangeDetectorRef } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector     : 'contacts-contact-list',
    templateUrl  : './contact-list.component.html',
    styleUrls    : ['./contact-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy
{

    searchInput: FormControl;
    hasSelectedContacts: boolean;
    
    @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;
    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;




    contacts: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = [
        
    'checkbox',

    'company',
    'name',
    'lastname',
    'email',
    'phone',
    'contact',
    'asiste',
    'buttons'
   
    ];
    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    loading: boolean = true;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ContactsService} _contactsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        public _contactsService: ContactsService,
        public _matDialog: MatDialog,
        private cdref: ChangeDetectorRef,
        private _fuseSidebarService: FuseSidebarService,
    )
    
    {

        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngAfterContentChecked() {

        this.dataSource = new FilesDataSource(this._contactsService, this.paginator);

       // this.onContactchanged()
        this.cdref.detectChanges();
        
    }



    ngOnInit(): void
    {

       this._contactsService.loadingContact = true;
     

       this.dataSource = new FilesDataSource(this._contactsService, this.paginator);

       this._contactsService.onContactsChanged
           .pipe(takeUntil(this._unsubscribeAll))
           .subscribe(contacts => {
               this.contacts = contacts;
               this.checkboxes = {};
               contacts.map(contact => {
                   this.checkboxes[contact.id] = false;

                   if(contacts.length > 0){


                    this._contactsService.contactsExist = true;
                    this._contactsService.loadingContact = false;
                }
            
                else {
                    console.log('is else ')
                    this._contactsService.contactsExist = false;
                    this._contactsService.loadingContact = false; 
                }

               });
           });

        let contacts = this.dataSource._contactsService.contacts;
        this._contactsService.contacts = contacts;

       
                   if(contacts.length > 0){


                    this._contactsService.contactsExist = true;
                    this._contactsService.loadingContact = false;
                }
            
                else {
                    this._contactsService.contactsExist = false;
                    this._contactsService.loadingContact = false; 
                }



        this._contactsService.onSelectedContactsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedContacts => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedContacts.includes(id);

                   
                }
                this.selectedContacts = selectedContacts;
                this.hasSelectedContacts = selectedContacts.length > 0
            });




            this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {

              

                this._contactsService.searchText = searchText;

                this._contactsService.getContacts(this._contactsService.idEventNow)

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

        this._contactsService.searchText = null;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit contact
     *
     * @param contact
     */
    editContact(contact): void
    {
        this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                contact: contact,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._contactsService.editContact(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteContact(contact);

                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteContact(contact): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false,
            panelClass: 'custom-dialog-container'
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Esta seguro de eliminar este invitado?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._contactsService.deleteContact(contact.id);
            }
            this.confirmDialogRef = null;
        });
    }
    /**
     * On selected change
     *
     * @param contactId
     */
    onSelectedChange(contactId): void
    {
        console.log('contactId',contactId)
        this._contactsService.toggleSelectedContact(contactId);
    }

    /**
     * Toggle star
     *
     * @param contactId
     */
    toggleStar(contactId): void
    {
        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }

        this._contactsService.updateUserData(this.user);
    }

    toggleSidebar(name): void
{
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}
}



export class FilesDataSource extends DataSource<any>
{


    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');


        /**
     * Constructor
     *
     * @param {ContactsService} _contactsService,
     * 
     */

    constructor(
        public _contactsService: ContactsService,
        private _matPaginator: MatPaginator,
    )
    {
        super();

        this.filteredData = this._contactsService.contacts;

    }

        // Filtered data
        get filteredData(): any
        {
            return this._filteredDataChange.value;
        }
    
        set filteredData(value: any)
        {
            this._filteredDataChange.next(value);
        }
    
        // Filter
        get filter(): string
        {
            return this._filterChange.value;
        }
    
        set filter(filter: string)
        {
            this._filterChange.next(filter);
        }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {

        const displayDataChanges = [
            this._contactsService.onContactsChanged,
            this._matPaginator.page,
            this._filterChange,
        ];
   
        return merge(...displayDataChanges)
            .pipe(
                map(() => {


                
                        let data = this._contactsService.contacts.slice();
                        data = this.filterData(data);

                        this.filteredData = [...data];

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    

   

                    }

                
                ));
    }

    

        filterData(data): any
        {
            if ( !this.filter )
            {
                return data;
            }
            return FuseUtils.filterArrayByString(data, this.filter);
        }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
