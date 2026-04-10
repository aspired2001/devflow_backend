import { Request, Response, NextFunction } from "express"
import { redis } from "../config/redis"

export const rateLimit = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.userId

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    const key = `ai_limit:${userId}`

    const count = await redis.incr(key)

    if (count === 1) {
        await redis.expire(key, 60)
    }

    if (count > 5) {
        return res.status(429).json({ error: "Too many requests" })
    }

    next()
}