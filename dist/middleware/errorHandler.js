"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Something went wrong",
        success: false,
        error: err.stack || err,
    });
};
exports.default = errorHandler;
