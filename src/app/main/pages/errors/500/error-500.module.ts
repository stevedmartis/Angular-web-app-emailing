import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { Error500Component } from 'app/main/pages/errors/500/error-500.component';
import { ConfirmInvitationService } from './confirm.service';

const routes = [
    {
        path     : 'confirm/200/:campaignId',
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

        FuseSharedModule
    ],
    providers: [
        ConfirmInvitationService
    ]
})
export class Error500Module
{
}
