import { Worker } from "bullmq"
import { analyzeDiagram } from "../ai.service"
import * as repo from "../ai.repository"
import { setCache } from "../../../utils/cache"

export const aiWorker = new Worker(
    "ai-analysis",
    async (job: any) => {
        const { projectId, jobId } = job.data

        try {
            console.log("JOB START:", jobId)

            const result = await analyzeDiagram(projectId)

            if (!result.graph.nodes.length) {
                throw new Error("Invalid graph")
            }

            await repo.completeJob(jobId, result)

            const cacheKey = `ai:${projectId}:${result.hash}`
            await setCache(cacheKey, result, 300)

            console.log("JOB COMPLETED:", jobId)
        } catch (error) {
            console.error("JOB FAILED:", jobId, error)

            await repo.failJob(jobId)
        }
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
)