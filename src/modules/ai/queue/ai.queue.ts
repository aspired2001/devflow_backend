import { Queue } from "bullmq"

export const aiQueue = new Queue("ai-analysis", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
})