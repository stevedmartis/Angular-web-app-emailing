import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject , Subscription} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { Contact } from 'app/main/apps/contacts/contact.model';
import * as XLSX from 'xlsx';  
import * as FileSaver from 'file-saver'; 
import { AuthService } from 'app/services/authentication/auth.service';

@Injectable()
export class ContactsService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    

    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];
    contactsArray: any[]
    loadingContact: boolean = true;

    searchText: string;
    filterBy: string;

    jsonData: any;  
    contactsCount: number = 0;
    fileUploaded: File;
    worksheet: any;
    selection = new SelectionModel<any>(true, []);
    idEventNow: any;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authServices: AuthService
    )
    {
        // Set the defaults
        this.onContactsChanged = new BehaviorSubject([]);
        this.onSelectedContactsChanged = new BehaviorSubject([]);
        this.onUserDataChanged = new BehaviorSubject([]);
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getContacts(this.idEventNow),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts(this.idEventNow);
                    });

                    this.onFilterChanged.subscribe(filter => {

             
                        this.filterBy = filter;
                        this.getContacts(this.idEventNow);
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(idEvent): Promise<any>
    {

        const Haeader = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'authorization': `${this.authServices.currentUserValue.token}`}),
          }


        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.apiUrl+'/api/person/event/' + idEvent, Haeader)
                    .subscribe((response: any) => {
                        
                        this.contacts = response;

                        console.log(this.contacts)

                        if ( this.filterBy === 'starred' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.starred.includes(_contact.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.contacts = this.contacts.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                        }

                        this.contacts = this.contacts.map(contact => {
                            return new Contact(contact);
                        });
                        
                        this.onContactsChanged.next(this.contacts);
                        resolve(this.contacts);

                        this.loadingContact = false;

                       
                    }, reject);
            }
        );
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get('api/contacts-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void
    {
        // First, check if we already have that contact as selected...
        if ( this.selectedContacts.length > 0 )
        {
            const index = this.selectedContacts.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

 

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedContacts.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void
    {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.contacts.map(contact => {
                this.selectedContacts.push(contact.id);
            });
        }

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Update contact
     *
     * @param contact
     * @returns {Promise<any>}
     */
    createContacts(obj): Promise<any>
    {

        const Haeader = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'authorization': `${this.authServices.currentUserValue.token}`}),
          }
        
        return new Promise((resolve, reject) => {

            console.log('entro update', obj)
            this._httpClient.post(environment.apiUrl + '/api/person/', obj, Haeader)
                .subscribe(response => {

  
                    console.log(response)
                   
                });
        });
    }

    createContact(obj): Promise<any>
    {

        const Haeader = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'authorization': `${this.authServices.currentUserValue.token}`}),
          }
        
        return new Promise((resolve, reject) => {

            console.log('entro update', obj)
            this._httpClient.post(environment.apiUrl + '/api/person/', obj, Haeader)
                .subscribe(response => {

                    this.getContacts(this.idEventNow)
                    resolve(response);
                    console.log(response)
                   
                });
        });
    }




    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getContacts(this.idEventNow);
                    resolve(response);
                });
        });
    }

    /**
     * Deselect contacts
     */
    deselectContacts(): void
    {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(contact): void
    {
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void
    {
        for ( const contactId of this.selectedContacts )
        {
            const contact = this.contacts.find(_contact => {
                return _contact.id === contactId;
            });
            const contactIndex = this.contacts.indexOf(contact);
            this.contacts.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.contacts);
        this.deselectContacts();
    }

    excelToJson(){

        this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });  
        this.jsonData = JSON.stringify(this.jsonData);  
        console.log(this.jsonData)
        const data: Blob = new Blob([this.jsonData], { type: "application/json" });  
        FileSaver.saveAs(data, "JsonFile" + new Date().getTime() + '.json'); 

    }

    xlsxToJson(){
        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        
    
        fileUpload.onchange = () => {

            this.loadingContact = true;
             const xlsx = fileUpload.files[0]

                let workBook = null;
                let jsonData = null;
                const reader = new FileReader();
                const file = xlsx
                reader.onload = (event) => {

                    

                  const data = reader.result;
                  workBook = XLSX.read(data, { type: 'binary' });
                  jsonData = workBook.SheetNames.reduce((initial, name) => {
                    const sheet = workBook.Sheets[name];
                    initial[name] = XLSX.utils.sheet_to_json(sheet);

                    this.contactsArray = initial[name];


                    console.log(this.contactsArray)
                

                    this.contactsArray.forEach(e => {

                        this.contactsCount++;
                      
                        let obj = {
                            codeEvento: this.idEventNow,
                            name: e.name || e.NOMBRES,  
                            lastname: e.lastname || e.APELLIDO_1,
                            email: e.email || e.EMAIL_1,
                            asiste: true,
                            status: null,
                            contractado: e.CONTACTADO,
                            jobtitle: e.jobtitle || e.CARGO,
                            company: e.company || e.EMPRESA,
                            phone: e.number || e.FONO_1,
                            asistio: false,
                            update: e.MODIFICADO_FECHA,
                            codeQr: e.COD_BARRA

                        }

                        console.log(' count',this.contactsCount, 'array:', this.contactsArray.length)
                       
                            this.createContacts(obj)


                    })
                    

                    //console.log('contactsArray: ', this.contactsArray)

                    console.log(' count',this.contactsCount, 'array:', this.contactsArray.length)
                    if(this.contactsArray.length == this.contactsCount){

                        console.log(' count actualif ',this.contactsCount)
                        this.getContacts(this.idEventNow)

                        
                    }

                    this.contactsCount = 0;

                    return initial;
                  }, {});
                  const dataString = JSON.stringify(jsonData);

                 
                  //document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
                  //this.setDownload(dataString);
                }
                reader.readAsBinaryString(file)

        }
        fileUpload.click();
        
    }

 
  

}
