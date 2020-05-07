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
import { InvitationQrScanService } from './invitation-qr-scan/invitation-qr-scan.service';
import { InvitationQrScanComponent } from './invitation-qr-scan/invitation-qr-scan.component';
import { AuthGuardService } from 'app/main/helpers/auth-guard.service';
import { MaterialModule } from 'app/main/angular-material-elements/material.module';

const routes = [
    {
        path     : ':nameEvent/:campaignId/:invitedId',
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
        
    },
    {
        path     : 'invited-qr-pass/:campaignId/:invitedId',
        canActivate: [ AuthGuardService ],
        component: InvitationQrScanComponent,
        resolve  : {
            data: InvitationQrScanService
        }
        
    }
];

@NgModule({
    declarations: [
        LockComponent,
        NewInvitedComponent,
        InvitationQrScanComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MaterialModule,
        FuseSharedModule
    ],
    providers: [
        FormInvitedService,
        FormInvitedNewService,
        InvitationQrScanService
    ]
})
export class LockModule
{
}
