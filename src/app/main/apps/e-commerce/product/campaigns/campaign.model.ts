import { FuseUtils } from '@fuse/utils';

export class Campaign
{
    _id: string;
    affair: string;
    imgBlob: string;
    sender: string;
    messageConfirm: string
    nameSender: string
    messageCancel: string
    footer: string;
    webLink: string;
    webLinkCharge: boolean;
    imgTitle: string
    
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
            this.nameSender = campaign.nameSender || '';

            this.footer = campaign.footer || '';
            this.messageConfirm = campaign.messageConfirm || '';
            this.messageCancel  = campaign.messageCancel || '';
            this.webLink = campaign.webLink || '';
            this.webLinkCharge = campaign.webLinkCharge || false;
            this.imgTitle = campaign.imgTitle || '';



        }
    }
}
