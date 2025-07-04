import express from 'express';
import { borrowBook, getBorrowedBooksSummary, getTopBorrowedBooks } from '../controllers/borrow.controller';

const router = express.Router();

router.post('/', borrowBook);         
router.get('/', getBorrowedBooksSummary);  
router.get('/top', getTopBorrowedBooks);  

export default router;
