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
import { MatSort } from '@angular/material/sort';

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
    
    contacts: any;
    user: any;
    dataSource: FilesDataSource | null;


    displayedColumns: any[] = this._contactsService.initColumns.map(col => col.name);
        
    displayedColumnsSelection : string[] 


    @ViewChild('dialogContent', {static: false})
    dialogContent: TemplateRef<any>;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

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

        this.dataSource = new FilesDataSource(this._contactsService, this.paginator,this.sort);

       // this.onContactchanged()
      

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

                this.cdref.detectChanges();
        
    }



    ngOnInit(): void
    {

       this._contactsService.loadingContact = true;
     

       //this.dataSource = new FilesDataSource(this._contactsService, this.paginator, this.sort);

       this._contactsService.onContactsChanged
           .pipe(takeUntil(this._unsubscribeAll))
           .subscribe(contacts => {
               this.contacts = contacts;
               this.checkboxes = {};
               contacts.map(contact => {
                   this.checkboxes[contact._id] = false;

                   if(contacts.length > 0){

            
                    if(this._contactsService.inputsArray.length > 0 ){

                        this._contactsService.initColumns = [];
                    
                        this._contactsService.initColumns = this._contactsService.inputsArray;
                      

                        this.displayedColumns = this._contactsService.initColumns.map(col => col.name);
                        

                     }
      
            

                    this._contactsService.contactsExist = true;
                    this._contactsService.loadingContact = false;
                }
            
                else {
                 
                    this._contactsService.contactsExist = false;
                    this._contactsService.loadingContact = false; 
                }

               });
           });


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

        this._contactsService.initColumns = [];
        this._contactsService.arraySelect  = [];

        this._contactsService.inputsArray  = [];
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
                const actionType: string = response[0]
                const formData: FormGroup = response[1]                      
                const dataForm =  formData.getRawValue()

                switch ( actionType )
                {

                    /**
                     * Save
                     */
                    case 'save':
                    
                        let datInit = {
                 
                            asiste: dataForm.asiste,
                            contactado: dataForm.contactado,
                            notes: dataForm.notes,
                        }

                        let objInvited = {}

                        dataForm.inputsFormContact.forEach(a1 => {
                                objInvited[a1.name]  = a1.value;
                            });

                            dataForm.inputsFormContact2.forEach(a2 => {
                                objInvited[a2.name]  = a2.value;
                            })                                


                    this._contactsService.editContact(dataForm.id, datInit, objInvited)
                    .then((res) => {

                    })

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteContact(contact);

                        break;

                        case 'duplicate':

                        this.duplicateContact(contact)

                        break;
                }
            });
    }

    duplicateContact(contact){
        this._contactsService.duplicateContact(contact);
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
                this._contactsService.deleteContact(contact._id);
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


    private _filteredDataChange = new BehaviorSubject('');


    /**
     * Constructor
     *
     * @param {EcommerceProductsService} _ecommerceProductsService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */

    constructor(
        public _contactsService: ContactsService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();


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

        

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {

        const displayDataChanges = [
            this._contactsService.onContactsChanged,
            this._matPaginator.page,
            this._matSort.sortChange
        ];
   
        return merge(...displayDataChanges)
            .pipe(
                map(() => {


                
                        let data = this._contactsService.contacts.slice();
                       

                        this.filteredData = [...data];

                        data = this.sortData(data);

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    

   

                    }

                
                ));
    }

 

        /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';



            switch ( this._matSort.active )
            {
                case 'id':
                    [propertyA, propertyB] = [a._id, b._id];
                    break;
                case 'name':
                    [propertyA, propertyB] = [a.name, b.name];
                    break;
                    case 'lastname':
                    [propertyA, propertyB] = [a.lastname, b.lastname];
                    break;
                    case 'company':
                    [propertyA, propertyB] = [a.company, b.company];
                    break;
                    case 'email':
                    [propertyA, propertyB] = [a.email, b.email];
                    break;
                    case 'phone':
                    [propertyA, propertyB] = [a.phone, b.phone];
                    break;
                    case 'contact':
                    [propertyA, propertyB] = [a.contact, b.contact];
                    break;
                    case 'asiste':
                    [propertyA, propertyB] = [a.asiste, b.asiste];
                    break;


            }
            



            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }


    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
