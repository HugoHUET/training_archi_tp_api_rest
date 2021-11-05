import { Router } from 'express';
import { UnknownBookError } from '../errors/unknown-book.error';
import { BooksService } from '../services/books.service';
import { requestLogger} from '../middlewareAuth'

const booksRouter = Router();

const booksService = new BooksService();


/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 */
booksRouter.get('/', (req, res) => {
    const books = booksService.getAllBooks();
    res.status(200).send(books);
})

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 */
booksRouter.get('/search', (req, res) => {
    const books = booksService.searchBook(req.query.search as string);
    res.status(200).send(books);
})

/**
 * @openapi
 * /books:
 *   post:
 *     summary: Create a new book
 */
booksRouter.post('/', (req, res) => {
    if (requestLogger(req.headers.authorization, "administrator")) {
        res.status(200).send(booksService.createBook(req.body));
    }else{
        res.status(403)
    }
})

/**
 * @openapi
 * /books:
 *   put:
 *     summary: Edit a book
 */
booksRouter.put('/:bookID', (req, res) => {
    if (requestLogger(req.header('authorization'), "administrator")) {
        try {
            res.status(200).send(booksService.updateBook(req.body));
        } catch (error) {
            res.status(400).send(error.message);
        }
    }else{
        res.status(403);
    }
})

/**
 * @openapi
 * /books:
 *   delete:
 *     summary: Delete a book
 */
booksRouter.delete('/:bookID', (req: any, res) => {
    if (requestLogger(req.header('authorization'), "administrator")) {
        try {
            res.status(200).send(booksService.deleteBook(req.params.bookID));
        } catch (error) {
            if (error instanceof UnknownBookError) {
                res.status(404)
            } else {
                res.status(400)
            }
            res.send(error.message)
        }
    }else{
        res.status(403);
    }
})

export default booksRouter;