import { Component, OnInit } from "@angular/core";
import { speedDialFabAnimations } from "./speed-dial-fab.animations";
import { ContactsContactFormDialogComponent } from "app/main/apps/contacts/contact-form/contact-form.component";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ContactsService } from "app/main/apps/contacts/contacts.service";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";

@Component({
    selector: "app-speed-dial-fab",
    templateUrl: "./speed-dial-fab.component.html",
    styleUrls: ["./speed-dial-fab.component.scss"],
    animations: speedDialFabAnimations,
})
export class SpeedDialFabComponent implements OnInit {
    dialogRef: any;
    contactInitial: boolean = false;

    loadingContact: boolean = false;

    emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    invitedNotData: boolean = false;

    fabButtons = [
        {
            icon: "cloud_download",
            click: "exportToXls",
        },
        {
            icon: "import_contacts",
            click: "importContacts",
        },
        {
            icon: "person_add",
            click: "newContact",
        },
    ];
    buttons = [];
    fabTogglerState = "inactive";

    constructor(
        private _matDialog: MatDialog,
        public _contactsService: ContactsService,
        private _matSnackBar: MatSnackBar
    ) {}

    showItems() {
        this.fabTogglerState = "active";
        this.buttons = this.fabButtons;
    }

    hideItems() {
        this.fabTogglerState = "inactive";
        this.buttons = [];
    }

    onToggleFab() {
        this.buttons.length ? this.hideItems() : this.showItems();
    }

    ngOnInit() {}

    newContact(): void {
        this.onToggleFab();

        this.dialogRef = this._matDialog.open(
            ContactsContactFormDialogComponent,
            {
                panelClass: "contact-form-dialog",
                data: {
                    action: "new",
                },
            }
        );

        this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
            if (!response) {
                return;
            }

            this.loadingContact = true;

            let dataForm = response.getRawValue();

            let objInvited = {
                codeEvento: this._contactsService.idEventNow,
                asiste: dataForm.asiste? dataForm.asiste: "",
                contactado: dataForm.contactado? dataForm.contactado: "",
                notes: dataForm.notes? dataForm.notes: "",
                emailValid: false,
                dataImport: [],
            };

            let obj = {};

            dataForm.inputsFormContact.forEach((a1) => {
                obj[a1.name] = a1.value?  a1.value : "";
            });

            dataForm.inputsFormContact2.forEach((a1) => {
                obj[a1.name] = a1.value?  a1.value : "";
            });

            objInvited.dataImport.push(obj);

            console.log(objInvited);

          const dataFound =  Object.keys(objInvited.dataImport[0])
            .forEach((val) => {
                console.log(objInvited.dataImport[0] );
                let value = objInvited.dataImport[0][val]? true : false;
                console.log(value, );

                if(value){

                    console.log(value, );
                   return false
                }

                else {

                    console.log(value, );
                   return true
                }

            })

            console.log(dataFound)


            Object.keys(objInvited.dataImport[0])
            .forEach((val) => {

                    console.log(val)

                
                  let value = objInvited.dataImport[0][val];

                  console.log(value)
                    if (this.emailPattern.test(value)) {
                   
                        this._contactsService
                            .validateEmail(value)
                            .then((valid) => {
                                objInvited.emailValid = valid;

                                this.createContact(objInvited)

                            });
                    }
                });



        });
    }

    createContact(objInvited){

        this._contactsService
        .createContact(objInvited)
        .then((res) => {

          console.log(res)
            let newTotal =
                this._contactsService.contacts
                    .length + 1;

            this._contactsService.editCountInvited(
                newTotal
            );

            this.loadingContact = false;
        })
        .catch(() => {
            this.loadingContact = false;
        });
    }

    importContacts() {
        //this._contactsService.excelToJson()

        this.onToggleFab();

        this._contactsService.xlsxToJson();
    }

    conditionCompleteCharge(arrayCount) {
        if (this._contactsService.contactsCount === arrayCount) {
            this._contactsService.contactsCount = 0;

            this.loadingContact = false;
            this._contactsService.editCountInvited(
                this._contactsService.contacts.length
            );

            this._matSnackBar.open("Carga completada", "OK", {
                verticalPosition: "top",
                duration: 6000,
            });
        }
    }

    exportToXls() {
        this._contactsService.exportAsExcelFile("bd_turevento");
    }

    onFileChange(ev) {
        this._contactsService.onFileChange(ev).then((data) => {
            this._contactsService.selectFieldsAddInvited(data).then((array) => {
                this.loadingContact = true;

                this.loadingContact = false;
                this._contactsService.editCountInvited(
                    this._contactsService.contacts.length
                );

                this.loadingContact = false;

                this._matSnackBar.open("Carga completada", "OK", {
                    verticalPosition: "top",
                    duration: 60000,
                });
            });
        });
    }

    newInvitedObj(data, valid) {
        let obj = {
            codeEvento: this._contactsService.idEventNow,
            name: data.name,
            title: data.title,
            lastname: data.lastname,
            email: data.email,
            emailValid: valid,
            address: data.address,
            jobtitle: data.jobtitle,
            company: data.company,
            phone: data.phone,
            asiste: "null",
            contactado: data.contactado,
            street: data.street,
            city: data.city,
            country: data.country,
            phoneMobil: data.phoneMobil,
            notes: data.notes,
        };

        this._contactsService
            .createContact(obj)
            .then(() => {
                let newTotal = this._contactsService.contacts.length + 1;

                this._contactsService.editCountInvited(newTotal);

                this.loadingContact = false;
            })
            .catch(() => {
                this.loadingContact = false;
            });
    }

    newInvitedForDB(data) {
        return new Promise((resolve, reject) => {
            if (data.email) {
                this._contactsService.validateEmail(data.email).then((res) => {
                    let obj = {
                        codeEvento: this._contactsService.idEventNow,
                        name: data.name,
                        title: data.title,
                        lastname: data.lastname,
                        emailValid: res,
                        email: data.email,
                        address: data.address,
                        jobtitle: data.jobtitle,
                        company: data.company,
                        phone: data.phone,
                        asiste: "null",
                        contactado: data.contactado,
                        street: data.street,
                        city: data.city,
                        country: data.country,
                        phoneMobil: data.phoneMobil,
                        notes: data.notes,
                    };

                    this._contactsService
                        .createContact(obj)
                        .then((res) => {
                            resolve(res);
                        })

                        .catch((err) => reject);
                });
            } else {
                let obj = {
                    codeEvento: this._contactsService.idEventNow,
                    name: data.name,
                    title: data.title,
                    lastname: data.lastname,
                    emailValid: false,
                    email: data.email,
                    address: data.address,
                    jobtitle: data.jobtitle,
                    company: data.company,
                    phone: data.phone,
                    asiste: "null",
                    contactado: data.contactado,
                    street: data.street,
                    city: data.city,
                    country: data.country,
                    phoneMobil: data.phoneMobil,
                    notes: data.notes,
                };

                this._contactsService
                    .createContact(obj)
                    .then((res) => {
                        resolve(res);
                    })

                    .catch((err) => reject);
            }
        });
    }

    handleClick(method: string) {
        switch (method) {
            case "newContact":
                this.newContact();
                break;
            case "importContacts":
                this.importContacts();
                break;
            case "exportToXls":
                this.exportToXls();

            default:
                break;
        }
    }
}
