import { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError"

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Known error (our custom errors)
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // Prisma errors (optional but useful)
    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            message: "Resource not found"
        })
    }

    // Unknown error
    console.error("🔥 ERROR:", err)

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}