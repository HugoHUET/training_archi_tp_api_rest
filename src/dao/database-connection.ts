import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

export class DatabaseConnection {

    private static connection: JsonDB = null;

    static getConnection(): JsonDB {
        if (this.connection !== null) {
            return this.connection;
        }
        const db = new JsonDB(new Config('db.json', true, true, '/'));
        this.connection = db;
        return this.connection;
    }
}