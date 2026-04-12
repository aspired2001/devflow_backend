import { Request, Response } from "express"
import * as service from "./ai.service"
import * as repo from "./ai.repository"
import { aiQueue } from "./queue/ai.queue"
import { getCache, setCache } from "../../utils/cache"

export const runAI = async (
    req: Request<{ projectId: string }>,
    res: Response
) => {
    const { projectId } = req.params

    // 🔹 Step 1: Run lightweight analysis to get hash ONLY
    const preview = await service.analyzeDiagram(projectId)
    const hash = preview.hash

    const cacheKey = `ai:${projectId}:${hash}`

    // ✅ CACHE CHECK
    const cached = await getCache(cacheKey)
    if (cached) {
        return res.json({
            status: "completed",
            source: "cache",
            result: cached
        })
    }

    // ✅ DB CHECK
    const existing = await repo.findByHash(projectId, hash)
    if (existing) {
        await setCache(cacheKey, existing.result, 300)

        return res.json({
            status: "completed",
            source: "db",
            result: existing.result
        })
    }

    // ✅ CREATE JOB
    const job = await repo.createJob(projectId, hash)

    await aiQueue.add("analyze", {
        projectId,
        jobId: job.id
    })

    return res.json({
        status: "pending",
        jobId: job.id
    })
}

// 🔹 STATUS
export const getStatus = async (req: Request, res: Response) => {
    const jobId = req.params.jobId as string

    const job = await repo.findById(jobId)

    if (!job) {
        return res.status(404).json({ error: "Job not found" })
    }

    res.json({
        status: job.status,
        result: job.result || null
    })
}