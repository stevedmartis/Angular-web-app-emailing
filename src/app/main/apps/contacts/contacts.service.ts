import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from "@angular/router";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { SelectionModel } from "@angular/cdk/collections";
import { FuseUtils } from "@fuse/utils";
import { environment } from "environments/environment";
import { Contact, ContactForXls } from "app/main/apps/contacts/contact.model";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { AuthService } from "app/services/authentication/auth.service";
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ContactsService {
    onContactsChanged: BehaviorSubject<any>;
    onSelectedContactsChanged: BehaviorSubject<any>;
    onUserDataChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    contactsExist: boolean = false;
    contactInitial: boolean = false;

    contacts: Contact[];
    user: any;
    selectedContacts: string[] = [];
    contactsArray: any[] = [];
    public loadingContact: boolean = false;

    searchText: string;
    filterBy: string;
    jsonData: any;
    contactsCount: number = 0;
    countSelect: number = 0;
    fileUploaded: File;
    worksheet: any;
    selection = new SelectionModel<any>(true, []);
    idEventNow: any;
    eventCreated: boolean = false;
    nameDataXlxs: any

    EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    EXCEL_EXTENSION = ".xlsx";

    contactsArrayXls: ContactForXls[] = [];

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private authServices: AuthService,
        private _matSnackBar: MatSnackBar,
    ) {
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
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(idEvent): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/invited/event/" + idEvent)
                .subscribe((response: any) => {
                   

                    this.contacts = response.invited;

                    /*
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

*/


                    if (this.searchText && this.searchText !== "") {
                       

                        this.contacts = FuseUtils.filterArrayByString(
                            this.contacts,
                            this.searchText
                        );
                    }

                    this.contacts = this.contacts.map(contact => {
                        return new Contact(contact);
                    });

                 

                    this.onContactsChanged.next(this.contacts);
                    resolve(this.contacts);
                }, reject);
        });
    }

    getContact(idInvited): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/invited/" + idInvited)
                .subscribe((response: any) => {
                    console.log(response);
                }, reject);
        });
    }

    
    validateEmail(email): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get(environment.apiUrl + "/api/validate-email/" + email)
                .subscribe((response: any) => {

                    let result = response.result.data.debounce.result;

                    let valid =
                    result === "Invalid"
                        ? false
                        : result === "Risky"
                        ? false
                        : result === "Safe to Send"
                        ? true
                        : result === "Unknown"
                        ? true
                        : null;

                    resolve(valid)
                }, reject);
        });
    }

    /**
     * Get user data
     *
     * @returns {Promise<any>}
     */
    getUserData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .get("api/contacts-user/5725a6802d10e277a0f35724")
                .subscribe((response: any) => {
                    this.user = response;
                    this.onUserDataChanged.next(this.user);
                    resolve(this.user);
                }, reject);
        });
    }

    /**
     * Toggle selected contact by id
     *
     * @param id
     */
    toggleSelectedContact(id): void {
        // First, check if we already have that contact as selected...
        if (this.selectedContacts.length > 0) {
            const index = this.selectedContacts.indexOf(id);

            if (index !== -1) {
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
    toggleSelectAll(): void {
        if (this.selectedContacts.length > 0) {
            this.deselectContacts();
        } else {
            this.selectContacts();
        }
    }

    /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    selectContacts(filterParameter?, filterValue?): void {
        this.selectedContacts = [];

        // If there is no filter, select all contacts
        if (filterParameter === undefined || filterValue === undefined) {
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
    createContactValidatorEmail(obj): Promise<any> {
        return new Promise((resolve, reject) => {
            
            this._httpClient
                .post(environment.apiUrl + "/api/invited/add-new-email-validator/", obj)
                .subscribe((response: any) => {
                           

                this.contacts.push(response.post);
                   this.onContactsChanged.next(this.contacts);
                    resolve(response)
                  
                }, reject);
        });
    }

    createContact(obj): Promise<any> {
        return new Promise((resolve, reject) => {
          
            this._httpClient
                .post(environment.apiUrl + "/api/invited/add-new-invited/", obj)

                .subscribe((response: any) => {
                 
                    console.log(response);

                

                   this.contacts.push(response.post);
                   this.onContactsChanged.next(this.contacts);

                   resolve(response);

                });
        });
    }

    editCountInvited(count): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/event/edit-count-invited/", {
                    countInvited: count,
                    eventId: this.idEventNow
                })
                .subscribe((response: any) => {
                    //this.getContacts(this.idEventNow)
                    resolve(response);
                    console.log(response);
                });
        });
    }

    editMessageId(invitedId, messageId): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/invited/messageId", {
                    invitedId: invitedId,
                    messageId: messageId
                })
                .subscribe((response: any) => {
                   
                    resolve(response);
                    console.log(response);
                }, reject);
        });
    }

    editContact(obj): Promise<any> {
        return new Promise((resolve, reject) => {
            //obj.send_email ? true : false;
           
            this._httpClient
                .post(environment.apiUrl + "/api/invited/edit-invited/", {
                    invitedId: obj.id,
                    codeEvento: this.idEventNow,
                    name: obj.name,
                    title: obj.title,
                    lastname: obj.lastname,
                    email: obj.email,
                    jobtitle: obj.jobtitle,
                    company: obj.company,
                    phone: obj.phone,
                    asiste: obj.asiste,
                    contactado: obj.contactado,
                    address: obj.address,
                    street: obj.street,
                    city: obj.city,
                    country: obj.country,
                    phoneMobil: obj.phoneMobil,
                    notes: obj.notes
                })
                .subscribe((response: any) => {
                    //this.getContacts(this.idEventNow)
                    resolve(response);
                  

                    this.getContacts(this.idEventNow).then(x => {
                       

                        this.editCountInvited(this.contacts.length);
                    });
                });
        });
    }

    duplicateContact(contact): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post(environment.apiUrl + "/api/invited/add-new-invited/", {
                    codeEvento: this.idEventNow,
                    name: contact.name,
                    title: contact.title,
                    lastname: contact.lastname,
                    company: contact.company,
                    jobtitle: contact.jobtitle,
                    email: "",
                    phone: contact.phone,
                    asiste: "null",
                    contactado: "null",
                    address: contact.address,
                    notes: contact.notes,
                    street: contact.street,
                    city: contact.city,
                    country: contact.country,
                    phoneMobil: contact.phoneMobil
                })

                .subscribe((response: any) => {

                    this.getContacts(this.idEventNow).then(x => {
                      

                        this.editCountInvited(this.contacts.length);
                    });
                });
        });
    }

    /**
     * Update user data
     *
     * @param userData
     * @returns {Promise<any>}
     */
    updateUserData(userData): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient
                .post("api/contacts-user/" + this.user.id, { ...userData })
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
    deselectContacts(): void {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    /**
     * Delete contact
     *
     * @param contact
     */
    deleteContact(id) {
        return new Promise((resolve, reject) => {
            this._httpClient
                .delete(environment.apiUrl + "/api/delete-invited/" + id)
                .subscribe(response => {
                    // this.conditionConatctExist();

                    this.editCountInvited(this.contacts.length);

                    this.getContacts(this.idEventNow);
                });
        });
    }

    conditionConatctExist() {

        if (this.contacts.length > 0) {
            this.contactsExist = true;
            this.loadingContact = false;
        } else {
            this.contactsExist = false;
            this.loadingContact = false;
        }
    }

    deleteAllContacts() {
        this.loadingContact = true;

        return new Promise((resolve, reject) => {
            this._httpClient
                .delete(
                    environment.apiUrl +
                        "/api/delete-all-invited/event/" +
                        this.idEventNow
                )
                .subscribe(response => {
                    this.getContacts(this.idEventNow).then(x => {
                        this.deselectContacts();

                        this.conditionConatctExist();

                        setTimeout(() => {
                            this.loadingContact = false;
                        }, 600);
                    });
                });
        });
    }

    /**
     * Delete selected contacts
     */
    deleteSelectedContacts(): void {
        this.loadingContact = true;

        for (const contactId of this.selectedContacts) {
            const contact = this.contacts.find(_contact => {
                return _contact.id === contactId;
            });

            this.deleteContact(contact.id);
        }
        //this.onContactsChanged.next(this.contacts);
        this.deselectContacts();
    }

    jsonToExcel() {
        this.jsonData = XLSX.utils.json_to_sheet(this.worksheet);
        this.jsonData = JSON.stringify(this.jsonData);

        const data: Blob = new Blob([this.jsonData], {
            type: "application/json"
        });
        FileSaver.saveAs(data, "JsonFile" + new Date().getTime() + ".json");
    }

    public exportAsExcelFile(excelFileName: string): void {
        
    

        this.contacts.forEach(c => {

            console.log('data: ', c);

            let obj = {
                EMPRESA: c.company,
                NOMBRE: c.name,
                APELLIDOS: c.lastname,
                CARGO: c.jobtitle,
                EMAIL: c.email,
                TELEONO: c.phone,
                TELEFONO_2: c.phoneMobil,
                ASISTE: c.asiste,
                CONTACTADO: c.contactado,
                CLICK: c.onClick ? 'SI' : 'NO',
                DIRECCION: c.address,
                COMUNA: c.street,
                CIUDAD: c.city,
                PAIS: c.country,
                OBSERVACION: c.notes,
                ESTADO: c.Status,
                FECHA_ESTADO: c.StatusDateTime
            };

            this.contactsArrayXls.push(obj);
        });
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
            this.contactsArrayXls
        );
        const workbook: XLSX.WorkBook = {
            Sheets: { 'data': worksheet },
            SheetNames: ["data"]
        };
        const excelBuffer: any = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array"
        });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: this.EXCEL_TYPE
        });
        FileSaver.saveAs(
            data,
            fileName + "_export_" + new Date().getTime() + this.EXCEL_EXTENSION
        );
    }


    onFileChange(ev): Promise<any> {

        return new Promise((resolve, reject) => {

        
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        const file = ev.target.files[0];


        const xlsx = file

        if(xlsx.name.includes("xls") || xlsx.name.includes("xlsx")){


        reader.onload = (event) => {
          const data = reader.result;
          workBook = XLSX.read(data, { type: 'binary' });
          jsonData = workBook.SheetNames.reduce((initial, name) => {
            const sheet = workBook.Sheets[name];
            initial[name] = XLSX.utils.sheet_to_json(sheet);

            this.nameDataXlxs = name;

            
            return initial;
          }, {});
          const dataString = jsonData;

          console.log(dataString)
          console.log(dataString.data)

          let contactsArray = [];

          let nameData = dataString.data? dataString.data : dataString.Hoja1? dataString.Hoja1 : '';
                        
          nameData.forEach(e => {

          

                let obj = {
                    codeEvento: this.idEventNow,
                    name:
                        e.name ||
                        e.NOMBRES ||
                        e.NOMBRE ||
                        e.nameEmployee ||
                        e.nombres ||
                        e.nombre,
                    title: e.title || e.TITLE || e.titulo || e.TITULO,
                    lastname:
                        e.lastname ||
                        e.APELLIDO_1 ||
                        e.apellidos ||
                        e.APELLIDOS,
                    email: e.email || e.email_1 || e.EMAIL_1 || e.EMAIL,
                    asiste: e.ASISTE || e.asiste,
                    status: null,
                    contactado: e.CONTACTADO,
                    jobtitle: e.jobtitle || e.CARGO || e.cargo,
                    company: e.company || e.EMPRESA || e.empresa,
                    phone:
                        e.number ||
                        e.FONO ||
                        e.FONO_1 ||
                        e.TELEFONO ||
                        e.TELEFONO_1 ||
                        e.fono ||
                        e.fono_1 ||
                        e.telefono ||
                        e.telefono_1,
                    phoneMobil:
                        e.CELULAR ||
                        e.FONO_2 ||
                        e.CELULAR_1 ||
                        e.TELEFONO_2 ||
                        e.celular ||
                        e.celular_2 ||
                        e.telefono_2 ||
                        e.TELEFONO_2 ||
                        e.FONO_2,
                    asistio: false,
                    update: e.MODIFICADO_FECHA,
                    address: e.DIRECCION,
                    street: e.COMUNA,
                    city: e.CIUDAD,
                    country: e.PAIS,
                    notes: e.OBSERVACIONES
                };

                contactsArray.push(obj);


 


            
        });

        console.log(contactsArray)

        resolve(contactsArray);

          
        
       
        }

    }
    else {
        this._matSnackBar.open('Archivo invalido', 'OK', {
            verticalPosition: 'top',
            duration        : 2000
        });


    }
        reader.readAsBinaryString(file);
      })

    }


    xlsxToJson() {

     

        const fileUpload = document.getElementById(
            "fileUpload"
        ) as HTMLInputElement;

        fileUpload.onchange = () => {

          
            fileUpload.value = '';
        
        
        };

        fileUpload.click();

   
        
    }


}
