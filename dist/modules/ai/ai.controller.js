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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.runAI = void 0;
const service = __importStar(require("./ai.service"));
const repo = __importStar(require("./ai.repository"));
const ai_queue_1 = require("./queue/ai.queue");
const cache_1 = require("../../utils/cache");
const runAI = async (req, res) => {
    const { projectId } = req.params;
    // 🔹 Step 1: Run lightweight analysis to get hash ONLY
    const preview = await service.analyzeDiagram(projectId);
    const hash = preview.hash;
    const cacheKey = `ai:${projectId}:${hash}`;
    // ✅ CACHE CHECK
    const cached = await (0, cache_1.getCache)(cacheKey);
    if (cached) {
        return res.json({
            status: "completed",
            source: "cache",
            result: cached
        });
    }
    // ✅ DB CHECK
    const existing = await repo.findByHash(projectId, hash);
    if (existing) {
        await (0, cache_1.setCache)(cacheKey, existing.result, 300);
        return res.json({
            status: "completed",
            source: "db",
            result: existing.result
        });
    }
    // ✅ CREATE JOB
    const job = await repo.createJob(projectId, hash);
    await ai_queue_1.aiQueue.add("analyze", {
        projectId,
        jobId: job.id
    });
    return res.json({
        status: "pending",
        jobId: job.id
    });
};
exports.runAI = runAI;
// 🔹 STATUS
const getStatus = async (req, res) => {
    const jobId = req.params.jobId;
    const job = await repo.findById(jobId);
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