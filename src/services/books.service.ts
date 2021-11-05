import { UnknownBookError } from '../errors/unknown-book.error'
import { BookDao } from '../dao/books.dao';
import { BookModel } from '../models/book.model';

const uuid = require('uuid')
const jwt = require('jsonwebtoken');

export class BooksService {
    private bookDAO: BookDao = new BookDao()

    public getAllBooks(): BookModel[] {
        return this.bookDAO.list()
    }

    public searchBook(query: string): BookModel[] {
        return this.bookDAO.find(query);
    }

    public getBookById(bookID: string): BookModel {
        return this.bookDAO.getByID(bookID);
    }

    public createBook(book: BookModel) {
        const bookToCreate = {
            ...book,
            id: uuid.v4()
        }
        return this.bookDAO.create(bookToCreate);
    }

    public deleteBook(bookID: string) {
        const book = this.bookDAO.getByID(bookID);
        if (!book) {
            throw new UnknownBookError('unknown book')
        }
        return this.bookDAO.delete(bookID);
    }

    public updateBook(book: BookModel): BookModel {
        const existingBook = this.bookDAO.getByID(book.id);
        if (!existingBook) {
            throw new UnknownBookError('unknown book')
        }
        const bookToUpdate = {
            ...existingBook,
            ...book
        }

        return this.bookDAO.update(bookToUpdate)
    }

}