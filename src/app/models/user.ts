export class User {
    _id: String;
    user: UserData;
    email: String;
    name: String;
    lastName: String;
    rol: String;
    username: String;
    password: String;
    salt: String;
    token: String;
    updated: Date

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(user) {
        {
            this._id = user._id || "";
            this.name = user.name || "";
            this.email = user.title || "";
            this.password = user.rut || "";
            this.rol = user.rol || "";
            this.username = user.username || "";
            this.lastName = user.lastName || "";
            this.salt = user.salt || "";
            this.token = user.company || "";
            this.updated = user.updated || ""
        }
    }
}

export interface UserData {
    _id: string;
    name: String;
    lastName: String,
    email: String,
    updated: Date,
    username: String,
    rol: String
}
