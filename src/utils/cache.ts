import { redis } from "../config/redis"

export const getCache = async (key: string) => {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
}

export const setCache = async (key: string, value: any, ttl = 60) => {
    await redis.set(key, JSON.stringify(value), "EX", ttl)
}

// ✅ ADD THIS
export const deleteCache = async (key: string) => {
    await redis.del(key)
}