"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeDiagram = void 0;
const db_1 = require("../../config/db");
const graph_builder_1 = require("./analyzers/graph.builder");
const pattern_detector_1 = require("./analyzers/pattern.detector");
const insight_generator_1 = require("./analyzers/insight.generator");
const advanced_analyzer_1 = require("./analyzers/advanced.analyzer");
const gemini_client_1 = require("./llm/gemini.client");
const prompt_builder_1 = require("./llm/prompt.builder");
const crypto_1 = __importDefault(require("crypto"));
const analyzeDiagram = async (projectId) => {
    const diagram = await db_1.prisma.diagram.findUnique({
        where: { projectId },
        include: {
            versions: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        }
    });
    if (!diagram || !diagram.versions.length) {
        throw new Error("No diagram found");
    }
    const rawData = diagram.versions[0].data;
    // =========================================================
    // ✅ STEP 1: EXTRACT ELEMENTS (STRICT + EXCALIDRAW SAFE)
    // =========================================================
    let elements = [];
    if (Array.isArray(rawData?.elements)) {
        elements = rawData.elements;
    }
    else if (Array.isArray(rawData?.data?.elements)) {
        elements = rawData.data.elements;
    }
    else if (Array.isArray(rawData?.nodes)) {
        // ✅ fallback for mock data (nodes/edges)
        elements = rawData.nodes.map((n) => ({
            id: n.id,
            type: "rectangle",
            customData: { archType: n.type }
        }));
        if (Array.isArray(rawData?.edges)) {
            elements.push(...rawData.edges.map((e) => ({
                id: `${e.from}-${e.to}`,
                type: "arrow",
                startBinding: { elementId: e.from },
                endBinding: { elementId: e.to }
            })));
        }
    }
    if (!elements.length) {
        throw new Error("Invalid diagram: no elements found");
    }
    // =========================================================
    // ✅ STEP 2: AUTO-INFER ARCH TYPES (CRITICAL FIX)
    // =========================================================
    const textMap = new Map();
    for (const el of elements) {
        if (el.type === "text" && el.containerId) {
            textMap.set(el.containerId, el.text?.toLowerCase() || "");
        }
    }
    const inferType = (label = "") => {
        if (label.includes("client"))
            return "client";
        if (label.includes("gateway"))
            return "apiGateway";
        if (label.includes("api"))
            return "apiGateway";
        if (label.includes("service"))
            return "service";
        if (label.includes("backend"))
            return "service";
        if (label.includes("cache"))
            return "cache";
        if (label.includes("redis"))
            return "cache";
        if (label.includes("db"))
            return "database";
        if (label.includes("database"))
            return "database";
        return "service";
    };
    for (const el of elements) {
        if (el.type !== "arrow" &&
            !el.customData?.archType) {
            const label = textMap.get(el.id);
            el.customData = {
                ...(el.customData || {}),
                archType: inferType(label)
            };
        }
    }
    // =========================================================
    // ✅ STEP 3: HASH (IDEMPOTENCY)
    // =========================================================
    const hash = crypto_1.default
        .createHash("sha256")
        .update(JSON.stringify(elements))
        .digest("hex");
    // =========================================================
    // ✅ STEP 4: GRAPH BUILD
    // =========================================================
    const graph = (0, graph_builder_1.buildGraph)(elements);
    if (!graph.nodes.length) {
        throw new Error("Invalid graph: no nodes generated");
    }
    // =========================================================
    // ✅ STEP 5: ANALYSIS PIPELINE
    // =========================================================
    const patterns = (0, pattern_detector_1.detectPatterns)(graph);
    const insights = (0, insight_generator_1.generateInsights)(patterns);
    const advanced = (0, advanced_analyzer_1.advancedAnalysis)(graph, patterns);
    const prompt = (0, prompt_builder_1.buildPrompt)(graph, insights, advanced);
    const raw = await (0, gemini_client_1.callGemini)(prompt);
    let ai;
    try {
        const raw = await (0, gemini_client_1.callGemini)(prompt);
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        ai = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw };
    }
    catch (err) {
        console.error("🔥 AI FALLBACK ACTIVATED");
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
        };
    }
    return {
        graph,
        patterns,
        insights,
        advanced, // 🔥 NEW
        ai,
        hash
    };
};
exports.analyzeDiagram = analyzeDiagram;
//# sourceMappingURL=ai.service.js.map