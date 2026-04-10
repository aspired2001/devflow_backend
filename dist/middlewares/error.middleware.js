"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const ApiError_1 = require("../utils/ApiError");
const errorHandler = (err, req, res, next) => {
    // Known error (our custom errors)
    if (err instanceof ApiError_1.ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }
    // Prisma errors (optional but useful)
    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Resource not found"
        });
    }
    // Unknown error
    console.error("🔥 ERROR:", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map