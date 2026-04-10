"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeDiagram = void 0;
const db_1 = require("../../config/db");
const graph_builder_1 = require("./analyzers/graph.builder");
const pattern_detector_1 = require("./analyzers/pattern.detector");
const insight_generator_1 = require("./analyzers/insight.generator");
const gemini_client_1 = require("./llm/gemini.client");
const prompt_builder_1 = require("./llm/prompt.builder");
const repo = __importStar(require("./ai.repository"));
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
    // ✅ FIX: normalize structure (handles Postman + Excalidraw)
    const elements = rawData.elements ||
        rawData.nodes ||
        rawData.data?.elements ||
        [];
    const connections = rawData.connections ||
        rawData.edges ||
        rawData.data?.connections ||
        [];
    const data = { elements, connections };
    // ✅ Idempotency hash
    const hash = crypto_1.default
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");
    const existing = await repo.findExisting(projectId, hash);
    if (existing) {
        return existing.result;
    }
    const graph = (0, graph_builder_1.buildGraph)(elements);
    const patterns = (0, pattern_detector_1.detectPatterns)(graph);
    const insights = (0, insight_generator_1.generateInsights)(patterns);
    const prompt = (0, prompt_builder_1.buildPrompt)(graph, insights);
    const raw = await (0, gemini_client_1.callGemini)(prompt);
    let ai;
    try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        ai = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw };
    }
    catch {
        ai = { raw };
    }
    return { graph, patterns, insights, ai };
};
exports.analyzeDiagram = analyzeDiagram;
//# sourceMappingURL=ai.service.js.map