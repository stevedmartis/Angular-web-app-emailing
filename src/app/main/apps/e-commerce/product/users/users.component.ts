import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation, TemplateRef } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";

import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs/operators';


import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { MatPaginator } from '@angular/material/paginator';

import {ChangeDetectorRef } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatSort } from '@angular/material/sort';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {
    


  searchInput: FormControl;
  hasSelectedContacts: boolean;
  
  contacts: any;
  user: any;
  dataSource: FilesDataSource | null;
  
  displayedColumns = [
      
  'checkbox',
  'name',
  'lastname',
  'email',
  'buttons'
 
  ];

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


  constructor(
    public _usersServices: UsersService,
    public _matDialog: MatDialog,
    private cdref: ChangeDetectorRef,
    private _fuseSidebarService: FuseSidebarService,) { 

    this.searchInput = new FormControl('');

    // Set the private defaults
    this._unsubscribeAll = new Subject();
    
  }


  ngAfterContentChecked() {

    this.dataSource = new FilesDataSource(this._usersServices, this.paginator,this.sort);

   // this.onContactchanged()
  

    let users = this.dataSource._usersServices.users;
    this._usersServices.users = users;

   
               if(users.length > 0){


                this._usersServices.contactsExist = true;
                this._usersServices.loadingContact = false;
            }
        
            else {
                this._usersServices.contactsExist = false;
                this._usersServices.loadingContact = false; 
            }

            this.cdref.detectChanges();
    
}


  ngOnInit(): void
  {

     this._usersServices.loadingContact = true;
   

     //this.dataSource = new FilesDataSource(this._contactsService, this.paginator, this.sort);

     this._usersServices.onContactsChanged
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe(contacts => {
             this.contacts = contacts;
             this.checkboxes = {};
             contacts.map(contact => {
                 this.checkboxes[contact.id] = false;

                 if(contacts.length > 0){


                  this._usersServices.contactsExist = true;
                  this._usersServices.loadingContact = false;
              }
          
              else {
              
                  this._usersServices.contactsExist = false;
                  this._usersServices.loadingContact = false; 
              }

             });
         });


      this._usersServices.onSelectedContactsChanged
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

            

              this._usersServices.searchText = searchText;

              this._usersServices.getUsersByIdEvent(this._usersServices.idEventNow)

          });
     
  }

  onSelectedChange(contactId): void
  {
          this._usersServices.toggleSelectedContact(contactId);
  }

  /**
   * Toggle star
   *
   * @param contactId
   */


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
        public _usersServices: UsersService,
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
            this._usersServices.onContactsChanged,
            this._matPaginator.page,
            this._matSort.sortChange
        ];
   
        return merge(...displayDataChanges)
            .pipe(
                map(() => {


                
                        let data = this._usersServices.users.slice();
                       

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
                    [propertyA, propertyB] = [a.id, b.id];
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

