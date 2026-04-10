"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiQueue = void 0;
const bullmq_1 = require("bullmq");
exports.aiQueue = new bullmq_1.Queue("ai-analysis", {
    connection: {
        host: "127.0.0.1",
        port: 6379
    }
});
//# sourceMappingURL=ai.queue.js.map