import { Request, Response } from "express"
import { analyzeDiagram } from "./ai.service"
import { aiQueue } from "./queue/ai.queue"
import * as repo from "./ai.repository"
import crypto from "crypto"
import { prisma } from "../../config/db"

export const runAnalysis = async (req: Request, res: Response) => {
    const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId

    const result = await analyzeDiagram(projectId)
    res.json(result)
}

export const runAsyncAnalysis = async (req: Request, res: Response) => {
    const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId

    // ✅ Get latest diagram
    const diagram = await prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        }
    })

    if (!diagram || !diagram.versions.length) {
        throw new Error("No diagram found")
    }

    const data = diagram.versions[0].data

    // ✅ Hash
    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex")

    // ✅ Check existing
    const existing = await repo.findExisting(projectId, hash)

    if (existing) {
        return res.json({
            status: "completed",
            result: existing.result
        })
    }

    // ✅ Create DB job FIRST
    const job = await repo.createJob(projectId, hash)

    // ✅ Push to queue with jobId
    await aiQueue.add("analyze", {
        projectId,
        jobId: job.id
    })

    res.json({
        status: "queued",
        jobId: job.id
    })
}

// ✅ Status endpoint (fix param typing issue)
export const getStatus = async (req: Request, res: Response) => {
    const jobId = Array.isArray(req.params.jobId)
        ? req.params.jobId[0]
        : req.params.jobId

    const job = await prisma.aiReview.findUnique({
        where: { id: jobId }
    })

    if (!job) {
        return res.status(404).json({ error: "Job not found" })
    }

    res.json({
        status: job.status,
        result: job.result || null
    })
}