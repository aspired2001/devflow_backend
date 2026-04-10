import { prisma } from "../../config/db"
import { buildGraph } from "./analyzers/graph.builder"
import { detectPatterns } from "./analyzers/pattern.detector"
import { generateInsights } from "./analyzers/insight.generator"
import { callGemini } from "./llm/gemini.client"
import { buildPrompt } from "./llm/prompt.builder"
import * as repo from "./ai.repository"
import crypto from "crypto"

export const analyzeDiagram = async (projectId: string) => {
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

    const rawData = diagram.versions[0].data as any

    // ✅ FIX: normalize structure (handles Postman + Excalidraw)
    const elements =
        rawData.elements ||
        rawData.nodes ||
        rawData.data?.elements ||
        []

    const connections =
        rawData.connections ||
        rawData.edges ||
        rawData.data?.connections ||
        []

    const data = { elements, connections }

    // ✅ Idempotency hash
    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex")

    const existing = await repo.findExisting(projectId, hash)

    if (existing) {
        return existing.result
    }

    const graph = buildGraph(elements)
    const patterns = detectPatterns(graph)
    const insights = generateInsights(patterns)

    const prompt = buildPrompt(graph, insights)
    const raw = await callGemini(prompt)

    let ai
    try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        ai = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }
    } catch {
        ai = { raw }
    }

    return { graph, patterns, insights, ai }
}