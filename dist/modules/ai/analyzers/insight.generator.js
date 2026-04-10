"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsights = void 0;
const generateInsights = (patterns) => {
    const insights = [];
    if (!patterns.hasCache) {
        insights.push({
            type: "performance",
            message: "No caching layer detected (Redis recommended)",
            severity: "medium"
        });
    }
    if (!patterns.hasQueue) {
        insights.push({
            type: "scalability",
            message: "No async queue found (BullMQ/Kafka recommended)",
            severity: "high"
        });
    }
    if (!patterns.hasAPI) {
        insights.push({
            type: "architecture",
            message: "Missing API Gateway layer",
            severity: "high"
        });
    }
    if (patterns.hasClient && patterns.hasDB && !patterns.hasService) {
        insights.push({
            type: "architecture",
            message: "Client directly talking to DB (bad design)",
            severity: "high"
        });
    }
    return insights;
};
exports.generateInsights = generateInsights;
//# sourceMappingURL=insight.generator.js.map