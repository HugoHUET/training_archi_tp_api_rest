import { CommentModel } from '../models/comment.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';

export class CommentDao {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(): CommentModel[] {
        return this.databaseConnection.getData('/comments');
    }

    public create(comment: CommentModel): CommentModel {
        this.databaseConnection.push('/comments[]', comment);
        return comment;
    }

    public delete(commentID: string): string {
        const index = this.getCommentIndexByID(commentID);
        if (index > -1) {
            this.databaseConnection.delete(`/comments[${index}]`)
            return commentID;
        }
    }

    public getByID(commentID: string): CommentModel {
        const index = this.getCommentIndexByID(commentID);
        if (index > -1) {
            return this.databaseConnection.getData(`/comments[${index}]`)
        }
    }

    public update(comment: CommentModel): CommentModel {
        const index = this.getCommentIndexByID(comment.id);
        if (index > -1) {
            this.databaseConnection.push(`/comments[${index}]`, comment, true)
            return comment
        }
    }

    private getCommentIndexByID(commentID: string): number {
        return this.databaseConnection.getIndex('/comments', commentID, 'id');
    }
}