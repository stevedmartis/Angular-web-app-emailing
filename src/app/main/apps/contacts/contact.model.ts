

export class Contact {
    _id: string;
    asiste: string;
    contactado: string;
    onClick: boolean;
    dateOnClick: Date;
    Status: string;
    StatusDateTime: Date;
    emailValid: Boolean;
    notes: String
    dataImport: [] = [];




    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this._id = contact._id || '';
            this.asiste = contact.asiste || 'null';
            this.contactado = contact.contactado || 'null';
            this.dataImport = this.dataImport || [];  
            this.onClick = contact.onClick || '';
            this.dateOnClick = contact.dateOnClick || '';
            this.Status = contact.Status || '';
            this.StatusDateTime = contact.StatusDateTime || '';
            this.emailValid = contact.emailValid || false;
            this.notes = contact.notes ||  '';

            
        }
    }
}



export interface ContactForXls {
    EMPRESA?: string;
    NOMBRE?: string;
    APELLIDOS?: string;
    CARGO?: string;
    EMAIL?: string;
    TELEONO?: string;
    TELEFONO_2?: string;
    ASISTE?: string;
    CONTACTADO?: string;
    CLICK?: string;
    DIRECCION?: string;
    COMUNA?: string;
    CIUDAD?: string;
    PAIS?: string;
    OBSERVACION?: string;


}

