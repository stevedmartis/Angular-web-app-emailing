import { FuseUtils } from '@fuse/utils';

export class Contact {
    id: string;
    name: string;
    lastname: string;
    avatar: string;
    nickname: string;
    company: string;
    jobtitle: string;
    email: string;
    send_email: boolean;
    phone: string;
    asiste: string;
    address: string;
    birthday: string;
    notes: string;

    street: string;
    city: string;
    country: string;
    phoneMobil: string

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(contact) {
        {
            this.id = contact._id || '';
            this.name = contact.name || '';
            this.lastname = contact.lastname || '';
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = contact.nickname || '';
            this.company = contact.company || '';
            this.jobtitle = contact.jobtitle || '';
            this.email = contact.email || '';
            this.send_email = contact.send_email;
            this.phone = contact.phone || '';
            this.asiste = contact.asiste || 'null';
            this.address = contact.address || '';
            this.birthday = contact.birthday || '';
            this.notes = contact.notes || '';
            this.street = contact.street || '';
            this.city = contact.city || ''
            this.country = contact.country || '';
            this.phoneMobil = contact.phoneMobil || '';
        }
    }
}
