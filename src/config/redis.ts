import Redis from "ioredis"

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379"

const options =
    process.env.REDIS_URL
        ? { tls: {}, maxRetriesPerRequest: null }
        : { maxRetriesPerRequest: null }

// 🔹 Main client
export const redis = new Redis(redisUrl, options)

// 🔹 Pub/Sub clients
export const pub = new Redis(redisUrl, options)
export const sub = new Redis(redisUrl, options)