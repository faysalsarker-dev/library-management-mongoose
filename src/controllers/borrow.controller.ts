import Book from "../models/book.model";
import Borrow from "../models/borrow.model";
import { Request, Response } from "express";





export const borrowBook = async (req: Request, res: Response):Promise<void> => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
     res.status(404).json({ success: false, message: "Book not found" });
      return 
    }

    if (book.copies < quantity) {
       res.status(400).json({
        success: false,
        message: `Only ${book.copies} copies available`,
      });
      return
    }

    book.copies -= quantity;

    book.handleCopies();

    await book.save();

    const borrow = await Borrow.create({ book: book._id, quantity, dueDate });

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




export const getBorrowedBooksSummary = async (req: Request, res: Response):Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: '$book', 
          totalQuantity: { $sum: '$quantity' },
        },
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookInfo',
        },
      },
      {
        $unwind: '$bookInfo',
      },
      {
        $project: {
          _id: 0,
          book: {
            title: '$bookInfo.title',
            isbn: '$bookInfo.isbn',
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.json({
      success: true,
      message: 'Borrowed books summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving borrowed books summary',
    });
  }
};

