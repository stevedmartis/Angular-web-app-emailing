import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { FormInvitedService } from '../../authentication/lock/form-invited.service';
import { ConfirmInvitationService } from './confirm.service';

@Component({
    selector     : 'error-500',
    templateUrl  : './error-500.component.html',
    styleUrls    : ['./error-500.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class Error500Component
{

    affair: any;
    /**
     * Constructor
     */
    constructor(private _fuseConfigService: FuseConfigService, public confirmInvitationService: ConfirmInvitationService)
    {

        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

}
