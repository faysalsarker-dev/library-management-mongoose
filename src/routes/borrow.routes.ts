import express from 'express';
import { borrowBook, getBorrowedBooksSummary } from '../controllers/borrow.controller';

const router = express.Router();

router.post('/', borrowBook);         
router.get('/', getBorrowedBooksSummary);  

export default router;
