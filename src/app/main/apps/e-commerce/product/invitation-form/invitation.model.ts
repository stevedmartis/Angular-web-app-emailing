

export class Invitation
{
    id: string;
    name: string;
    lastname: string;
    avatar: string;
    nickname: string;
    company: string;
    jobtitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;

    /**
     * Constructor
     *
     * @param invitation
     */
    constructor(invitation)
    {
        {
            this.id = invitation._id || '';
            this.name = invitation.name || '';
            this.lastname = invitation.lastname || '';
            this.avatar = invitation.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = invitation.nickname || '';
            this.company = invitation.company || '';
            this.jobtitle = invitation.jobtitle || '';
            this.email = invitation.email || '';
            this.phone = invitation.phone || '';
            this.address = invitation.address || '';
            this.birthday = invitation.birthday || '';
            this.notes = invitation.notes || '';
        }
    }
}
