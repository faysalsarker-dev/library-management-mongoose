
import { Request, Response } from "express";
import Book from "../models/book.model";


export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
 
    const errors: Record<string, string> = {};

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
    }

    res.status(400).json({
      success: false,
      message: "Validation failed",
      error: Object.keys(errors).length ? errors : error.message,
    });
  }
};






export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const {
      filter,              
      sort = "desc",       
      sortBy = "createdAt", 
      limit = "10",        
    } = req.query as Record<string, string>;

    const query: any = {};

    
    if (filter) {
      query.genre = filter.toUpperCase(); 
    }

    const sortOrder = sort.toLowerCase() === "asc" ? 1 : -1;
    const sortQuery: any = { [sortBy]: sortOrder };

   
    const books = await Book.find(query)
      .sort(sortQuery)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve books",
      error: error.message || error,
    });
  }
};





export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve books",
      error: error.message || error,
    });
  }
};




export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndUpdate(
  { _id: req.params.id },
  { $set: { ...req.body } },
   {
        new: true,           
        runValidators: true, 
      }
);;

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve books",
      error: error.message || error,
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to delete book",
      error: error.message || error,
    });
  }
};





