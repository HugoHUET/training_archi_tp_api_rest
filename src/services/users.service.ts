import { UnknownUserError } from '../errors/unknown-user.error'
import { UserDao } from '../dao/users.dao';
import { UserModel, UserWithToken } from '../models/user.model';
import jwt from 'jsonwebtoken'

const uuid = require('uuid')

export class UsersService {
    private userDAO: UserDao = new UserDao()

    public getAllUsers(): UserModel[] {
        return this.userDAO.list()
    }

    public getUserById(userID: string): UserModel{
        return this.userDAO.getByID(userID);
    }

    public createUser(user: UserModel) {
        if (!this.checkUserToCreateIsValid(user)) {
            throw new Error('invalid user');
        }

        const userToCreate = {
            ...user,
            id: uuid.v4()
        }
        return this.userDAO.create(userToCreate);
    }

    public deleteUser(userID: string, currentUserID: string) {
        if (userID === currentUserID) {
            throw new Error('user cannot remove himself !')
        }
        const user = this.userDAO.getByID(userID);
        if (!user) {
            throw new UnknownUserError('unknown user')
        }
        return this.userDAO.delete(userID);
    }

    public updateUser(user: UserModel): UserModel {
        const existingUser = this.userDAO.getByID(user.id);
        if (!existingUser) {
            throw new UnknownUserError('unknown user')
        }
        const userToUpdate = {
            ...existingUser,
            ...user
        }

        return this.userDAO.update(userToUpdate)
    }

    public login(email: string, password: string): UserWithToken {
        if (!email || !password) {
            throw new Error('all inputs are required');
        }

        const user = this.userDAO.getByEmail(email);
        if (user && user.password === password) {
            const token = jwt.sign(
                user,
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )

            return {
                ...user,
                token
            }
        } else {
            throw new UnknownUserError()
        }
    }

    private checkUserToCreateIsValid(user: UserModel) {
        return user && user.email && user.password && user.firstName && user.lastName
    }

}