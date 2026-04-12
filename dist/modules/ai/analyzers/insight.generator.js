"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInsights = void 0;
const generateInsights = (p) => {
    const insights = [];
    // 🔥 Core infra gaps
    if (!p.hasCache) {
        insights.push({
            type: "performance",
            message: "Missing caching layer (Redis recommended)",
            severity: "medium"
        });
    }
    if (!p.hasQueue) {
        insights.push({
            type: "scalability",
            message: "No async queue (Kafka / SQS recommended)",
            severity: "high"
        });
    }
    if (!p.hasAPI) {
        insights.push({
            type: "architecture",
            message: "Missing API Gateway",
            severity: "high"
        });
    }
    // 🔥 Anti-patterns
    if (p.godService) {
        insights.push({
            type: "architecture",
            message: "God Service detected (violates SRP, scaling risk)",
            severity: "high"
        });
    }
    if (p.isChatty) {
        insights.push({
            type: "performance",
            message: "Chatty service communication (high network overhead)",
            severity: "medium"
        });
    }
    if (p.hasDirectApiCache) {
        insights.push({
            type: "architecture",
            message: "API Gateway directly accessing cache (leaky abstraction)",
            severity: "medium"
        });
    }
    if (p.isFullySync) {
        insights.push({
            type: "scalability",
            message: "Fully synchronous architecture (risk of cascading failures)",
            severity: "high"
        });
    }
    // 🔥 Architecture classification insight
    insights.push({
        type: "architecture",
        message: `Detected architecture: ${p.architecture}`,
        severity: "low"
    });
    return insights;
};
exports.generateInsights = generateInsights;
//# sourceMappingURL=insight.generator.js.map