"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGraph = void 0;
const buildGraph = (elements) => {
    const nodesMap = new Map();
    const edges = [];
    // ✅ STEP 1: Build nodes (clean + enriched)
    for (const el of elements) {
        const archType = el.customData?.archType;
        //  Skip invalid / label-like nodes
        if (!archType || typeof archType !== "string")
            continue;
        if (archType.toLowerCase().includes("label"))
            continue;
        // ✅ Avoid duplicates
        if (!nodesMap.has(el.id)) {
            nodesMap.set(el.id, {
                id: el.id,
                type: archType,
                // ✅ NEW: Optional metadata (non-breaking)
                metadata: {
                    label: el.text || null,
                    position: el.x && el.y ? { x: el.x, y: el.y } : null
                }
            });
        }
    }
    // ✅ STEP 2: Build edges (with type support)
    for (const el of elements) {
        if (el.type !== "arrow")
            continue;
        const from = el.startBinding?.elementId;
        const to = el.endBinding?.elementId;
        //  Skip broken edges
        if (!from || !to)
            continue;
        if (!nodesMap.has(from) || !nodesMap.has(to))
            continue;
        // ✅ Default type (future extensibility)
        const edgeType = el.customData?.edgeType || "sync"; // future: async, read, write
        edges.push({
            from,
            to,
            type: edgeType
        });
    }
    return {
        nodes: Array.from(nodesMap.values()),
        edges
    };
};
exports.buildGraph = buildGraph;
//# sourceMappingURL=graph.builder.js.map