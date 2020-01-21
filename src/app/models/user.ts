export interface User{
    id: String;
    user: UserData;
    email: String;
    name: String;
    password: String;
    salt: String
    token: String
}


export interface UserData{
    _id: string
}