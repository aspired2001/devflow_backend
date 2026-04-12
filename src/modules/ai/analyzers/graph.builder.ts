import { Graph } from "../types"

export const buildGraph = (elements: any[]): Graph => {
    const nodesMap = new Map<string, any>()
    const edges: any[] = []

    // 🔥 STEP 0: Build text map (AGAIN here for safety)
    const textMap = new Map<string, string>()

    for (const el of elements) {
        if (el.type === "text" && el.containerId) {
            textMap.set(el.containerId, el.text?.toLowerCase() || "")
        }
    }

    const inferType = (label: string = "") => {
        if (!label) return "unknown"
        if (label.includes("client")) return "client"
        if (label.includes("gateway")) return "apiGateway"
        if (label.includes("api")) return "apiGateway"
        if (label.includes("service")) return "service"
        if (label.includes("backend")) return "service"
        if (label.includes("cache")) return "cache"
        if (label.includes("redis")) return "cache"
        if (label.includes("db")) return "database"
        if (label.includes("database")) return "database"
        return "service"
    }

    // ✅ STEP 1: Build nodes (FIXED)
    for (const el of elements) {
        if (el.type === "arrow") continue

        const label = textMap.get(el.id) || ""
        const archType =
            el.customData?.archType ||
            inferType(label)

        // 🔥 DO NOT SKIP — even if unknown
        if (!nodesMap.has(el.id)) {
            nodesMap.set(el.id, {
                id: el.id,
                type: archType || "unknown",
                metadata: {
                    label: label || null,
                    position:
                        el.x && el.y
                            ? { x: el.x, y: el.y }
                            : null
                }
            })
        }
    }

    // ✅ STEP 2: Build edges (unchanged but safer)
    for (const el of elements) {
        if (el.type !== "arrow") continue

        const from = el.startBinding?.elementId
        const to = el.endBinding?.elementId

        if (!from || !to) continue
        if (!nodesMap.has(from) || !nodesMap.has(to)) continue

        edges.push({
            from,
            to,
            type: el.customData?.edgeType || "sync"
        })
    }

    return {
        nodes: Array.from(nodesMap.values()),
        edges
    }
}