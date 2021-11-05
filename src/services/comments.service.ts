import { UnknownCommentError } from '../errors/unknown-comment.error'
import { CommentDao } from '../dao/comments.dao';
import { CommentModel } from '../models/comment.model';

const uuid = require('uuid')
const jwt = require('jsonwebtoken');

export class CommentsService {
    private commentDAO: CommentDao = new CommentDao()

    public getAllComments(): CommentModel[] {
        return this.commentDAO.list()
    }

    public getCommentById(commentID: string): CommentModel{
        return this.commentDAO.getByID(commentID);
    }

    public createComment(comment: CommentModel) {
        if (!this.checkCommentToCreateIsValid(comment)) {
            throw new Error('invalid Comment');
        }

        const commentToCreate = {
            ...comment,
            id: uuid.v4()
        }
        return this.commentDAO.create(commentToCreate);
    }

    public deleteComment(commentID: string, currentCommentID: string) {
        if (commentID === currentCommentID) {
            throw new Error('Comment cannot remove himself !')
        }
        const comment = this.commentDAO.getByID(commentID);
        if (!comment) {
            throw new UnknownCommentError('unknown Comment')
        }
        return this.commentDAO.delete(commentID);
    }

    public updateComment(comment: CommentModel): CommentModel {
        const existingComment = this.commentDAO.getByID(comment.id);
        if (!existingComment) {
            throw new UnknownCommentError('unknown Comment')
        }
        const commentToUpdate = {
            ...existingComment,
            ...comment
        }

        return this.commentDAO.update(commentToUpdate)
    }

    private checkCommentToCreateIsValid(comment: CommentModel) {
        return comment && comment.userId && comment.bookId && comment.comment;
    }

}