import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FuseSharedModule } from '@fuse/shared.module';

import { ResetPasswordComponent } from 'app/main/pages/authentication/reset-password/reset-password.component';
import { ResetPasswordService } from './reset-password.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes = [
    {
        path     : 'auth/reset-password/:id',
        component: ResetPasswordComponent,
        resolve  : {
            data: ResetPasswordService
        }
    }
];

@NgModule({
    declarations: [
        ResetPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,

        FuseSharedModule
    ],
    providers: [
        ResetPasswordService
    ]
})
export class ResetPasswordModule
{
}
