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
exports.getStatus = exports.runAsyncAnalysis = exports.runAnalysis = void 0;
const ai_service_1 = require("./ai.service");
const ai_queue_1 = require("./queue/ai.queue");
const repo = __importStar(require("./ai.repository"));
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../../config/db");
const runAnalysis = async (req, res) => {
    const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId;
    const result = await (0, ai_service_1.analyzeDiagram)(projectId);
    res.json(result);
};
exports.runAnalysis = runAnalysis;
const runAsyncAnalysis = async (req, res) => {
    const projectId = Array.isArray(req.params.projectId)
        ? req.params.projectId[0]
        : req.params.projectId;
    // ✅ Get latest diagram
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
    const data = diagram.versions[0].data;
    // ✅ Hash
    const hash = crypto_1.default
        .createHash("sha256")
        .update(JSON.stringify(data))
        .digest("hex");
    // ✅ Check existing
    const existing = await repo.findExisting(projectId, hash);
    if (existing) {
        return res.json({
            status: "completed",
            result: existing.result
        });
    }
    // ✅ Create DB job FIRST
    const job = await repo.createJob(projectId, hash);
    // ✅ Push to queue with jobId
    await ai_queue_1.aiQueue.add("analyze", {
        projectId,
        jobId: job.id
    });
    res.json({
        status: "queued",
        jobId: job.id
    });
};
exports.runAsyncAnalysis = runAsyncAnalysis;
// ✅ Status endpoint (fix param typing issue)
const getStatus = async (req, res) => {
    const jobId = Array.isArray(req.params.jobId)
        ? req.params.jobId[0]
        : req.params.jobId;
    const job = await db_1.prisma.aiReview.findUnique({
        where: { id: jobId }
    });
    if (!job) {
        return res.status(404).json({ error: "Job not found" });
    }
    res.json({
        status: job.status,
        result: job.result || null
    });
};
exports.getStatus = getStatus;
//# sourceMappingURL=ai.controller.js.map