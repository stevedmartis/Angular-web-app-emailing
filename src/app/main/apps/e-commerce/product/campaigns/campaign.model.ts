import { FuseUtils } from '@fuse/utils';

export class Campaign
{
    _id: string;
    affair: string;
    imgBlob: string;
    sender: string;
    messageConfirm: string
    messageCancel: string
    footer: string;
    
    /**
     * Constructor
     *
     * @param campaign
     */
    constructor(campaign)
    {
        {
            this._id = campaign._id || '';
            this.affair = campaign.affair || '';
            this.imgBlob = campaign.imgBlob || '';
            this.sender = campaign.sender || '';
            this.footer = campaign.footer || '';
            this.messageConfirm = campaign.messageConfirm || '';
            this.messageCancel  = campaign.messageCancel || ''


        }
    }
}
