"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const borrow_routes_1 = __importDefault(require("./routes/borrow.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use(express_1.default.json());
app.use(errorHandler_1.default);
app.use('/api/books', book_routes_1.default);
app.use('/api/borrow', borrow_routes_1.default);
// Test route
app.get("/", (_req, res) => {
    res.send("API is running...");
});
(0, db_1.default)().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server started on http://localhost:${port}`);
    });
});
