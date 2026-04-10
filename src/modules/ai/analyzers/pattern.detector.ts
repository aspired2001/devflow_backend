// analyzers/pattern.detector.ts
import { Graph } from "../types"

export const detectPatterns = (graph: Graph) => {
    const types = graph.nodes.map(n => n.type)

    const hasClient = types.includes("client")
    const hasAPI = types.includes("apiGateway")
    const hasService = types.includes("service")
    const hasDB = types.includes("database")
    const hasCache = types.includes("cache")
    const hasQueue = types.includes("queue")

    // 🔹 Edge analysis
    const syncEdges = graph.edges.filter(e => e.type === "sync").length
    const asyncEdges = graph.edges.filter(e => e.type === "async").length

    const isFullySync = asyncEdges === 0

    // 🔹 Coupling detection (API → Cache direct)
    const hasDirectApiCache = graph.edges.some(
        e =>
            e.type === "sync" &&
            graph.nodes.find(n => n.id === e.from)?.type === "apiGateway" &&
            graph.nodes.find(n => n.id === e.to)?.type === "cache"
    )

    // 🔹 Service → DB dependency
    const serviceToDB = graph.edges.some(
        e =>
            graph.nodes.find(n => n.id === e.from)?.type === "service" &&
            graph.nodes.find(n => n.id === e.to)?.type === "database"
    )

    // 🔹 Layered flow detection
    const hasLayeredFlow =
        hasClient && hasAPI && hasService && hasDB

    return {
        // existing
        hasClient,
        hasAPI,
        hasService,
        hasDB,
        hasCache,
        hasQueue,

        // 🔥 NEW SIGNALS
        isFullySync,
        hasAsync: asyncEdges > 0,
        syncEdges,
        asyncEdges,

        hasDirectApiCache,
        serviceToDB,
        hasLayeredFlow
    }
}