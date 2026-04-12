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
exports.aiWorker = void 0;
const bullmq_1 = require("bullmq");
const ai_service_1 = require("../ai.service");
const repo = __importStar(require("../ai.repository"));
const cache_1 = require("../../../utils/cache");
exports.aiWorker = new bullmq_1.Worker("ai-analysis", async (job) => {
    const { projectId, jobId } = job.data;
    try {
        console.log("JOB START:", jobId);
        const result = await (0, ai_service_1.analyzeDiagram)(projectId);
        if (!result.graph.nodes.length) {
            throw new Error("Invalid graph");
        }
        await repo.completeJob(jobId, result);
        const cacheKey = `ai:${projectId}:${result.hash}`;
        await (0, cache_1.setCache)(cacheKey, result, 300);
        console.log("JOB COMPLETED:", jobId);
    }
    catch (error) {
        console.error("JOB FAILED:", jobId, error);
        await repo.failJob(jobId);
    }
}, {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
//# sourceMappingURL=ai.worker.js.map