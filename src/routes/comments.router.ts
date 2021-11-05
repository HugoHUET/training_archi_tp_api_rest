import { Router } from 'express';
import { CommentsService } from '../services/comments.service';
import { requestLogger} from '../middlewareAuth'
const CommentRouter = Router();

const commentsService = new CommentsService();


/**
 * @openapi
 * /comments:
 *   get:
 *     summary: Retrieve a list of all comment
 */
CommentRouter.get('/', (req, res) => {
    const Comment = commentsService.getAllComments();
    res.status(200).send(Comment);
})

/**
 * @openapi
 * /comments/{id}:
 *   get:
 *     summary: Retrieve a comment
 */
 CommentRouter.get('/:commentID', (req, res) => {
    const comment = commentsService.getCommentById(req.params.commentID);
    res.status(200).send(comment);
})


/**
 * @openapi
 * /comments:
 *   post:
 *     summary: Create a new comment
 */
CommentRouter.post('/', (req, res) => {
    if (requestLogger(req.headers.authorization)) {
        res.status(200).send(commentsService.createComment(req.body))
    } else {
        res.status(400);
    }
})

/**
 * @openapi
 * /comments/{id}:
 *   put:
 *     summary: Edit a comment
 */
CommentRouter.put('/:commentID', (req, res) => {
    if (requestLogger(req.headers.authorization)) {
        res.status(200).send(commentsService.updateComment(req.body));
    } else {
        res.status(400);
    }
})

/**
 * @openapi
 * /comments:
 *   delete:
 *     summary: Delete a comment
 */
CommentRouter.delete('/:commentID', (req: any, res) => {
    if (requestLogger(req.headers.authorization)) {
        res.status(200).send(commentsService.deleteComment(req.params.commentID, "req.comment.id"))
    } else {
        res.status(400);
    }
})

export default CommentRouter;