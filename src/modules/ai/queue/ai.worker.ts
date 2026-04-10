import { Worker } from "bullmq"
import { analyzeDiagram } from "../ai.service"
import * as repo from "../ai.repository"

export const aiWorker = new Worker(
    "ai-analysis",
    async (job: any) => {
        const { projectId, jobId } = job.data

        try {
            const start = Date.now()

            const result = await analyzeDiagram(projectId)

            // ✅ Save result
            await repo.completeJob(jobId, result)

            const duration = Date.now() - start

            console.log({
                service: "AI_WORKER",
                jobId,
                status: "completed",
                duration: `${duration}ms`
            })
        } catch (error) {
            console.error({
                service: "AI_WORKER",
                jobId,
                status: "failed",
                error: (error as Error).message
            })

            // ✅ Ensure failure handled
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