import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '@fuse/shared.module';

import { Error404Component } from 'app/main/pages/errors/404/error-404.component';
import { CancelInvitationService } from './cancel.service';

const routes = [
    {
        path     : 'confirm/no/:campaignId',
        component: Error404Component,
        resolve  : {
            data: CancelInvitationService
        }
        
    }
];
@NgModule({
    declarations: [
        Error404Component
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatIconModule,

        FuseSharedModule
    ],
    providers: [
        CancelInvitationService
    ]
})
export class Error404Module
{
}
