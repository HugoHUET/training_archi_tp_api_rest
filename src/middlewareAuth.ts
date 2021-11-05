import jwt from 'jsonwebtoken'
import { UserModel } from './models/user.model';

export function requestLogger(token: string, role?: string): UserModel {
    try {
        const verified: UserModel = jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY) as UserModel;

        if (!role || (role && verified.roles.includes(role))) {
            return verified
        }else{
            throw new Error('Not authorized');
        }
    } catch (error) {
        throw new Error(error);
    }
};
