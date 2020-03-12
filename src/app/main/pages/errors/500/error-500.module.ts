import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { Error500Component } from 'app/main/pages/errors/500/error-500.component';
import { ConfirmInvitationService } from './confirm.service';
import { QRCodeModule } from 'angularx-qrcode';

const routes = [
    {
        path     : 'confirm/si/:campaignId/:invitedId',
        component: Error500Component,
        resolve  : {
            data: ConfirmInvitationService
        }
        
    }
];

@NgModule({
    declarations: [
        Error500Component
    ],
    imports     : [
        RouterModule.forChild(routes),
        QRCodeModule,
        FuseSharedModule
    ],
    providers: [
        ConfirmInvitationService
    ]
})
export class Error500Module
{
}
