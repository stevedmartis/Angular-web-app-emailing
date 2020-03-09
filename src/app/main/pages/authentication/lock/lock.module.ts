import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '@fuse/shared.module';
import { LockComponent } from 'app/main/pages/authentication/lock/lock.component';
import { FormInvitedService } from '../lock/form-invited.service';
import { FormInvitedNewService } from '../lock/form-invited-new.service';
import { NewInvitedComponent } from './new-invited-event.component';

const routes = [
    {
        path     : 'confirm-invited/:campaignId/:invitedId',
        component: LockComponent,
        resolve  : {
            data: FormInvitedService
        }
        
    },
    {
        path     : 'invitacion/:campaignId',
        component: NewInvitedComponent,
        resolve  : {
            data: FormInvitedNewService
        }
        
    }
];

@NgModule({
    declarations: [
        LockComponent,
        NewInvitedComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FuseSharedModule
    ],
    providers: [
        FormInvitedService,
        FormInvitedNewService
    ]
})
export class LockModule
{
}
