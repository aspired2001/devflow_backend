"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = exports.setCache = exports.getCache = void 0;
const redis_1 = require("../config/redis");
const getCache = async (key) => {
    const data = await redis_1.redis.get(key);
    return data ? JSON.parse(data) : null;
};
exports.getCache = getCache;
const setCache = async (key, value, ttl = 60) => {
    await redis_1.redis.set(key, JSON.stringify(value), "EX", ttl);
};
exports.setCache = setCache;
// ✅ ADD THIS
const deleteCache = async (key) => {
    await redis_1.redis.del(key);
};
exports.deleteCache = deleteCache;
//# sourceMappingURL=cache.js.map