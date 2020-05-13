

export class Contact {
    id: string;
    rut: string;
    name: string;
    title: string;
    lastname: string; 
    company: string;
    jobtitle: string;
    email: string;
    phone: string;
    asiste: string;
    contactado: string;
    address: string;
    notes: string;
    street: string;
    city: string;
    country: string;
    phoneMobil: string;
    onClick: boolean;
    dateOnClick: Date;
    Status: string;
    StatusDateTime: Date;
    emailValid: Boolean



    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.id = contact._id || '';
            this.name = contact.name || '';
            this.title = contact.title || '';
            this.rut =contact.rut || '';
            this.lastname = contact.lastname || '';
            this.company = contact.company || '';
            this.jobtitle = contact.jobtitle || '';
            this.email = contact.email || '';
            this.phone = contact.phone || '';
            this.asiste = contact.asiste || 'null';
            this.contactado = contact.contactado || 'null';
            this.address = contact.address || '';
            this.notes = contact.notes || '';
            this.street = contact.street || '';
            this.city = contact.city || ''
            this.country = contact.country || '';
            this.phoneMobil = contact.phoneMobil || '';
            this.onClick = contact.onClick || '';
            this.dateOnClick = contact.dateOnClick || '';
            this.Status = contact.Status || '';
            this.StatusDateTime = contact.StatusDateTime || '';
            this.emailValid = contact.emailValid || false;

            
        }
    }
}



export interface ContactForXls {
    EMPRESA: string;
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

