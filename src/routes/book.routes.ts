import express from 'express';
import {

getAllBooks,
getBookById,
createBook,
updateBook,
deleteBook,
groupBooksByGenre,
} from '../controllers/book.controller';

const router = express.Router();


router.get('/', getAllBooks);


router.get('/group', groupBooksByGenre);
router.get('/:id', getBookById);


router.post('/', createBook);


router.put('/:id', updateBook);


router.delete('/:id', deleteBook);

export default router;