// modules/ai/types.ts

export interface GraphNode {
    id: string
    type: string

    // ✅ optional (future-ready, no break)
    metadata?: {
        label?: string | null
        position?: { x: number; y: number } | null
    }
}

export interface GraphEdge {
    from: string
    to: string

    // ✅ NEW (optional → no breaking change)
    type?: "sync" | "async" | "read" | "write"
}

export interface Graph {
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export interface Insight {
    type: string
    message: string
    severity: "low" | "medium" | "high"
}