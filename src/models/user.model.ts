export interface UserModel {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    roles: string[];
}

export interface UserWithToken extends UserModel {
    token: string;
}