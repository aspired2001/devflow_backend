import Redis from "ioredis"

const options = {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null
}

// 🔹 Main client (general use)
export const redis = new Redis(options)

// 🔹 Pub/Sub clients (IMPORTANT for scaling)
export const pub = new Redis(options)
export const sub = new Redis(options)