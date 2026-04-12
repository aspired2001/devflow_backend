import { prisma } from "../../config/db"
import { buildGraph } from "./analyzers/graph.builder"
import { detectPatterns } from "./analyzers/pattern.detector"
import { generateInsights } from "./analyzers/insight.generator"
import { advancedAnalysis } from "./analyzers/advanced.analyzer"
import { callGemini } from "./llm/gemini.client"
import { buildPrompt } from "./llm/prompt.builder"
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

    // =========================================================
    // ✅ STEP 1: EXTRACT ELEMENTS (STRICT + EXCALIDRAW SAFE)
    // =========================================================
    let elements: any[] = []

    if (Array.isArray(rawData?.elements)) {
        elements = rawData.elements
    } else if (Array.isArray(rawData?.data?.elements)) {
        elements = rawData.data.elements
    } else if (Array.isArray(rawData?.nodes)) {
        // ✅ fallback for mock data (nodes/edges)
        elements = rawData.nodes.map((n: any) => ({
            id: n.id,
            type: "rectangle",
            customData: { archType: n.type }
        }))

        if (Array.isArray(rawData?.edges)) {
            elements.push(
                ...rawData.edges.map((e: any) => ({
                    id: `${e.from}-${e.to}`,
                    type: "arrow",
                    startBinding: { elementId: e.from },
                    endBinding: { elementId: e.to }
                }))
            )
        }
    }

    if (!elements.length) {
        throw new Error("Invalid diagram: no elements found")
    }

    // =========================================================
    // ✅ STEP 2: AUTO-INFER ARCH TYPES (CRITICAL FIX)
    // =========================================================
    const textMap = new Map<string, string>()

    for (const el of elements) {
        if (el.type === "text" && el.containerId) {
            textMap.set(el.containerId, el.text?.toLowerCase() || "")
        }
    }

    const inferType = (label: string = "") => {
        if (label.includes("client")) return "client"
        if (label.includes("gateway")) return "apiGateway"
        if (label.includes("api")) return "apiGateway"
        if (label.includes("service")) return "service"
        if (label.includes("backend")) return "service"
        if (label.includes("cache")) return "cache"
        if (label.includes("redis")) return "cache"
        if (label.includes("db")) return "database"
        if (label.includes("database")) return "database"
        return "service"
    }

    for (const el of elements) {
        if (
            el.type !== "arrow" &&
            !el.customData?.archType
        ) {
            const label = textMap.get(el.id)
            el.customData = {
                ...(el.customData || {}),
                archType: inferType(label)
            }
        }
    }

    // =========================================================
    // ✅ STEP 3: HASH (IDEMPOTENCY)
    // =========================================================
    const hash = crypto
        .createHash("sha256")
        .update(JSON.stringify(elements))
        .digest("hex")

    // =========================================================
    // ✅ STEP 4: GRAPH BUILD
    // =========================================================
    const graph = buildGraph(elements)

    if (!graph.nodes.length) {
        throw new Error("Invalid graph: no nodes generated")
    }

    // =========================================================
    // ✅ STEP 5: ANALYSIS PIPELINE
    // =========================================================
    const patterns = detectPatterns(graph)
    const insights = generateInsights(patterns)
    const advanced = advancedAnalysis(graph, patterns)

    const prompt = buildPrompt(graph, insights, advanced)
    const raw = await callGemini(prompt)

    let ai

    try {
        const raw = await callGemini(prompt)

        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        ai = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw }

    } catch (err) {
        console.error("🔥 AI FALLBACK ACTIVATED")

        ai = {
            analysis: "AI service temporarily unavailable. Using rule-based analysis.",
            issues: insights.map((i, idx) => ({
                id: `AUTO-${idx}`,
                severity: i.severity,
                component: "system",
                description: i.message
            })),
            suggestions: [],
            adr: []
        }
    }

    return {
        graph,
        patterns,
        insights,
        advanced, // 🔥 NEW
        ai,
        hash
    }
}