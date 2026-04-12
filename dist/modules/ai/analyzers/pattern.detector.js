"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPatterns = void 0;
const detectPatterns = (graph) => {
    const types = graph.nodes.map(n => n.type);
    const hasClient = types.includes("client");
    const hasAPI = types.includes("apiGateway");
    const hasService = types.includes("service");
    const hasDB = types.includes("database");
    const hasCache = types.includes("cache");
    const hasQueue = types.includes("queue");
    // 🔹 Edge stats
    const syncEdges = graph.edges.filter(e => e.type === "sync").length;
    const asyncEdges = graph.edges.filter(e => e.type === "async").length;
    const isFullySync = asyncEdges === 0;
    // 🔹 Degree map (for anti-pattern detection)
    const degree = {};
    for (const edge of graph.edges) {
        degree[edge.from] = (degree[edge.from] || 0) + 1;
        degree[edge.to] = (degree[edge.to] || 0) + 1;
    }
    // 🔥 Anti-patterns
    // 1. God Service
    const godService = Object.entries(degree).some(([nodeId, deg]) => {
        const node = graph.nodes.find(n => n.id === nodeId);
        return node?.type === "service" && deg >= 4;
    });
    // 2. Chatty services (too many service-to-service calls)
    const serviceToServiceEdges = graph.edges.filter(e => {
        const from = graph.nodes.find(n => n.id === e.from)?.type;
        const to = graph.nodes.find(n => n.id === e.to)?.type;
        return from === "service" && to === "service";
    }).length;
    const isChatty = serviceToServiceEdges >= 3;
    // 3. Direct API → Cache (leak)
    const hasDirectApiCache = graph.edges.some(e => graph.nodes.find(n => n.id === e.from)?.type === "apiGateway" &&
        graph.nodes.find(n => n.id === e.to)?.type === "cache");
    // 4. Service → DB
    const serviceToDB = graph.edges.some(e => graph.nodes.find(n => n.id === e.from)?.type === "service" &&
        graph.nodes.find(n => n.id === e.to)?.type === "database");
    // 🔥 Architecture classification
    let architecture = "unknown";
    if (graph.nodes.length <= 2) {
        architecture = "monolith";
    }
    else if (hasClient && hasAPI && hasService && hasDB) {
        architecture = "layered";
    }
    if (serviceToServiceEdges >= 2 && graph.nodes.length > 4) {
        architecture = "microservices";
    }
    return {
        hasClient,
        hasAPI,
        hasService,
        hasDB,
        hasCache,
        hasQueue,
        isFullySync,
        hasAsync: asyncEdges > 0,
        syncEdges,
        asyncEdges,
        hasDirectApiCache,
        serviceToDB,
        // 🔥 NEW
        architecture,
        godService,
        isChatty,
        serviceToServiceEdges
    };
};
exports.detectPatterns = detectPatterns;
//# sourceMappingURL=pattern.detector.js.map