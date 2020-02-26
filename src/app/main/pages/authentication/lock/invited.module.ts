

export class Invited {
    codeEvento: string;
    name: string;
    lastname: string;
    email: string;
    district: string;
    street: string;
    address: string;
    apartmentOffice: string;
    created: string;
    company: string;
    jobtitle: string;
    zip_code: string;
    phone: string;
    website: string;
    asiste: true;
    asistio: false;
    status: string;
    sendEmail: true;
    codeQr: string;
    update: null;
    send_email: null;
    contactado: string;
    observation: string;
    _id: string;
    user: string;

    /**
     * Constructor
     *
     * @param product
     */
    constructor(invited?) {
        invited = invited || {};
        this.codeEvento = invited.codeEvento || '';
        this.name = invited.name || '';
        this.lastname = invited.lastname || '';
        this.email = invited.email || '';
        this.district = invited,this.district || '';
        this.street = invited.street || '';
        this.address = invited.address || '';
        this.apartmentOffice = invited.apartmentOffice || '';
        this.created = invited.created || '';
        this.company = invited.company || '';
        this.jobtitle = invited.jobtitle || '';
        this.zip_code = invited.zip_code || '';
        this.phone = invited.phone || '';
        this.website = invited.website || '';
        this.asiste = invited.asiste || true;
        this.asistio = invited.asistio || true;
        this.status = invited.status || '';
        this.sendEmail = invited.send_email || '';
        this.codeQr = invited.codeQr || '';
        this.update = invited.update || '';
        this.send_email = invited.send_email || '';
        this.contactado = invited.contactado || '';
        this.observation = invited.observation || '';
        this._id = invited._id || '';
        this.user = invited.user || '';

    }
}