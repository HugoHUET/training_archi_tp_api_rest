import { UserModel } from '../models/user.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';

export class UserDao {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(): UserModel[] {
        return this.databaseConnection.getData('/users');
    }

    public create(user: UserModel): UserModel {
        this.databaseConnection.push('/users[]', user);
        return user;
    }

    public delete(userID: string): string {
        const index = this.getUserIndexByID(userID);
        if (index > -1) {
            this.databaseConnection.delete(`/users[${index}]`)
            return userID;
        }
    }

    public getByID(userID: string): UserModel {
        const index = this.getUserIndexByID(userID);
        if (index > -1) {
            return this.databaseConnection.getData(`/users[${index}]`)
        }
    }

    public update(user: UserModel): UserModel {
        const index = this.getUserIndexByID(user.id);
        if (index > -1) {
            this.databaseConnection.push(`/users[${index}]`, user, true)
            return user
        }
    }

    public getByEmail(email: string): UserModel {
        const index = this.databaseConnection.getIndex('/users', email, 'email');
        if (index > -1) {
            return this.databaseConnection.getObject(`/users[${index}]`)
        }
        return null;
    }

    private getUserIndexByID(userID: string): number {
        return this.databaseConnection.getIndex('/users', userID, 'id');
    }
}