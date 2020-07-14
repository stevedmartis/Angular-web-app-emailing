

export class Invited {
    _id: string;
    asiste: string;
    contactado: string;
    onClick: boolean;
    dateOnClick: Date;
    Status: string;
    StatusDateTime: Date;
    emailValid: Boolean;
    notes: String
    dataImport = [];




    /**
     * Constructor
     *
     * @param invited
     */
    constructor(invited) {
        {
            this._id = invited._id || '';
            this.asiste = invited.asiste || 'null';
            this.contactado = invited.contactado || 'null';
            this.dataImport = this.dataImport || [
               
            ];  
            this.onClick = invited.onClick || '';
            this.dateOnClick = invited.dateOnClick || '';
            this.Status = invited.Status || '';
            this.StatusDateTime = invited.StatusDateTime || '';
            this.emailValid = invited.emailValid || false;
            this.notes = invited.notes ||  '';

            
        }
    }
}

