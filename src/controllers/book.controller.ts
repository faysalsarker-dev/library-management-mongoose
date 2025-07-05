import { Request, Response } from "express";
import Book from "../models/book.model";

export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      filter,
      sort = "desc",
      sortBy = "createdAt",

      limit = "10",
      page = "1",
    } = req.query as Record<string, string>;

    const query: any = {};

    if (filter) {
      const searchRegex = new RegExp(filter, "i");
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
        { genre: searchRegex },
      ];
    }

    const sortOrder = sort.toLowerCase() === "asc" ? 1 : -1;
    const sortQuery: any = { [sortBy]: sortOrder };

    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Book.countDocuments(query);

    const books = await Book.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      totalItems: total,
      totalPages: Math.ceil(total / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve books",
      error: error.message || error,
    });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
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

export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
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

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
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

export const groupBooksByGenre = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupedBooks = await Book.aggregate([
      {
        $group: {
          _id: "$genre",
          totalCopies: { $sum: "$copies" },
        },
      },
      {
        $project: {
          genre: "$_id",
          totalCopies: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Books grouped by genre with total copies",
      data: groupedBooks,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "Failed to group books by genre",
      error: error.message || error,
    });
  }
};


