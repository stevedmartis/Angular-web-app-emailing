

export class Contact {
    id: string;
    asiste: string;
    contactado: string;
    onClick: boolean;
    dateOnClick: Date;
    Status: string;
    StatusDateTime: Date;
    emailValid: Boolean
    inputs: []



    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.id = contact._id || '';
            this.asiste = contact.asiste || 'null';
            this.contactado = contact.contactado || 'null';

            this.onClick = contact.onClick || '';
            this.dateOnClick = contact.dateOnClick || '';
            this.Status = contact.Status || '';
            this.StatusDateTime = contact.StatusDateTime || '';
            this.emailValid = contact.emailValid || false;
            this.inputs = contact.inputs || [];

            
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

