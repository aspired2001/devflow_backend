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
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiWorker = void 0;
const bullmq_1 = require("bullmq");
const ai_service_1 = require("../ai.service");
const repo = __importStar(require("../ai.repository"));
exports.aiWorker = new bullmq_1.Worker("ai-analysis", async (job) => {
    const { projectId, jobId } = job.data;
    try {
        const start = Date.now();
        const result = await (0, ai_service_1.analyzeDiagram)(projectId);
        // ✅ Save result
        await repo.completeJob(jobId, result);
        const duration = Date.now() - start;
        console.log({
            service: "AI_WORKER",
            jobId,
            status: "completed",
            duration: `${duration}ms`
        });
    }
    catch (error) {
        console.error({
            service: "AI_WORKER",
            jobId,
            status: "failed",
            error: error.message
        });
        // ✅ Ensure failure handled
        await repo.failJob(jobId);
    }
}, {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
//# sourceMappingURL=ai.worker.js.map