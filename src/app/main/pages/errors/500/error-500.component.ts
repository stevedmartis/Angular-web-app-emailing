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
export class Error500Component implements OnInit
{

    affair: any;
    public myAngularxQrCode: string = null;    
    
    qrcodename : string;
    title = 'generate-qrcode';
    elementType: 'url' | 'canvas' | 'img' = 'url';
    value: string;
    display = false;
    href : string;

    ngOnInit(){
        this.generateQRCode()
    }
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


    generateQRCode(){

        this.myAngularxQrCode = 'http://www.turevento.net/#/pages/invited-qr-pass/5e5ef3de7289df4630602f53/5e5fb1047289df4630602f56'
        
        
      

    }
}
