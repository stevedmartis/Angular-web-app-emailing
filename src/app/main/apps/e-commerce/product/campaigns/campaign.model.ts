import { FuseUtils } from '@fuse/utils';

export class Campaign
{
    id: string;
    asunto: string;
    img: string;
    remite: string;
    footer: string;
    
    /**
     * Constructor
     *
     * @param campaign
     */
    constructor(campaign)
    {
        {
            this.id = campaign._id || '';
            this.asunto = campaign.asunto || '';
            this.img = campaign.img || '';
            this.remite = campaign.remite || '';
            this.footer = campaign.footer || '';


        }
    }
}
