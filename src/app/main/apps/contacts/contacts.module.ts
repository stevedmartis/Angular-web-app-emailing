import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ContactsComponent } from 'app/main/apps/contacts/contacts.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactListComponent } from 'app/main/apps/contacts/contact-list/contact-list.component';
import { ContactsSelectedBarComponent } from 'app/main/apps/contacts/selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from 'app/main/apps/contacts/sidebars/main/main.component';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import {  SpeedDialFabComponent } from 'app/layout/speed-dial-fab/speed-dial-fab.component';


import { MatPaginatorModule } from '@angular/material';
import { MaterialModule } from 'app/main/angular-material-elements/material.module';
import { SelectFieldsComponent } from './contact-list/dialog/select-fields/select-fields.component';

const routes: Routes = [
    {
        path     : 'contacts',
        component: ContactsComponent,
        resolve  : {
            contacts: ContactsService
        }
    }
];

@NgModule({

declarations: [
    ContactsComponent,
    ContactsContactListComponent,
    ContactsSelectedBarComponent,
    ContactsMainSidebarComponent,
    ContactsContactFormDialogComponent,
    SpeedDialFabComponent,
    SelectFieldsComponent
],

    exports: [
        ContactsComponent,
        ContactsContactListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        ContactsContactFormDialogComponent,
        SpeedDialFabComponent,
        SelectFieldsComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MaterialModule,

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
     
    ],
    providers      : [
        ContactsService,
    
        
    ],
    entryComponents: [
        ContactsContactFormDialogComponent,
    ]
})
export class ContactsModule
{
}
