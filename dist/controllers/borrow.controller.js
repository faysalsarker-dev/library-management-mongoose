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
exports.getTopBorrowedBooks = exports.getBorrowedBooksSummary = exports.borrowBook = void 0;
const book_model_1 = __importDefault(require("../models/book.model"));
const borrow_model_1 = __importDefault(require("../models/borrow.model"));
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        const book = yield book_model_1.default.findById(bookId);
        if (!book) {
            res.status(404).json({ success: false, message: "Book not found" });
            return;
        }
        if (book.copies < quantity) {
            res.status(400).json({
                success: false,
                message: `Only ${book.copies} copies available`,
            });
            return;
        }
        book.copies -= quantity;
        book.handleCopies();
        yield book.save();
        const borrow = yield borrow_model_1.default.create({ book: book._id, quantity, dueDate });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.borrowBook = borrowBook;
const getBorrowedBooksSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const summary = yield borrow_model_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            {
                $unwind: "$bookInfo",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);
        const totalItems = ((_b = (_a = summary[0]) === null || _a === void 0 ? void 0 : _a.totalCount[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
        const totalPages = Math.ceil(totalItems / limit);
        res.json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary[0].data,
            totalItems,
            totalPages,
            currentPage: page,
        });
    }
    catch (error) {
        console.error("Aggregation error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while retrieving borrowed books summary",
        });
    }
});
exports.getBorrowedBooksSummary = getBorrowedBooksSummary;
const getTopBorrowedBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topBooks = yield borrow_model_1.default.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $sort: { totalQuantity: -1 },
            },
            {
                $limit: 3,
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            {
                $unwind: "$bookInfo",
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.json({
            success: true,
            message: "Top 3 borrowed books retrieved successfully",
            data: topBooks,
        });
    }
    catch (error) {
        console.error("Error fetching top 3 borrowed books:", error);
        res.status(500).json({
            success: false,
            message: "Server error while retrieving top 3 borrowed books",
        });
    }
});
exports.getTopBorrowedBooks = getTopBorrowedBooks;
