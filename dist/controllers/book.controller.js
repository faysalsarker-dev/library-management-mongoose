"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBooksByGenre = exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.createBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.create(req.body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        const errors = {};
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
});
exports.createBook = createBook;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sort = "desc", sortBy = "createdAt", limit = "10", } = req.query;
        const query = {};
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
        const sortQuery = { [sortBy]: sortOrder };
        const books = yield book_model_1.default.find(query)
            .sort(sortQuery)
            .limit(Number(limit));
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message || error,
        });
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message || error,
        });
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findByIdAndUpdate(req.params.id, { $set: Object.assign({}, req.body) }, {
            new: true,
            runValidators: true,
        });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to retrieve books",
            error: error.message || error,
        });
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findByIdAndDelete(req.params.id);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete book",
            error: error.message || error,
        });
    }
});
exports.deleteBook = deleteBook;
const groupBooksByGenre = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupedBooks = yield book_model_1.default.aggregate([
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to group books by genre",
            error: error.message || error,
        });
    }
});
exports.groupBooksByGenre = groupBooksByGenre;
