"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
const redis_1 = require("../config/redis");
const rateLimit = async (req, res, next) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const key = `ai_limit:${userId}`;
    const count = await redis_1.redis.incr(key);
    if (count === 1) {
        await redis_1.redis.expire(key, 60);
    }
    if (count > 5) {
        return res.status(429).json({ error: "Too many requests" });
    }
    next();
};
exports.rateLimit = rateLimit;
//# sourceMappingURL=rateLimit.middleware.js.map