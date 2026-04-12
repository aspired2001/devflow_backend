import { Graph } from "../types"

export const advancedAnalysis = (graph: Graph, patterns: any) => {
    const nodeCount = graph.nodes.length
    const edgeCount = graph.edges.length

    // =========================================
    // 🔥 1. COST ESTIMATION (AWS STYLE)
    // =========================================
    let cost = 0
    const breakdown: any = {}

    if (patterns.hasAPI) {
        breakdown.apiGateway = 20
        cost += 20
    }

    if (patterns.hasService) {
        breakdown.compute = nodeCount * 15 // EC2/ECS rough
        cost += breakdown.compute
    }

    if (patterns.hasDB) {
        breakdown.database = 50 // RDS base
        cost += 50
    }

    if (patterns.hasCache) {
        breakdown.cache = 25 // Redis
        cost += 25
    }

    if (patterns.hasQueue) {
        breakdown.queue = 15 // SQS/Kafka basic
        cost += 15
    }

    const estimatedMonthlyCost = `$${cost} - $${cost * 2}`

    // =========================================
    // 🔥 2. LATENCY SIMULATION
    // =========================================
    let latency = 0

    if (patterns.hasAPI) latency += 20
    if (patterns.hasService) latency += 40
    if (patterns.hasDB) latency += 60
    if (patterns.hasCache) latency -= 20
    if (patterns.hasQueue) latency -= 10

    const estimatedLatency = `${latency}ms`

    // =========================================
    // 🔥 3. TRAFFIC SCALING PREDICTION
    // =========================================
    let scalabilityScore = 0

    if (patterns.hasQueue) scalabilityScore += 2
    if (patterns.hasCache) scalabilityScore += 2
    if (!patterns.isFullySync) scalabilityScore += 2
    if (!patterns.godService) scalabilityScore += 1

    let trafficCapacity = "Low"

    if (scalabilityScore >= 5) trafficCapacity = "High (100k+ req/min)"
    else if (scalabilityScore >= 3) trafficCapacity = "Medium (10k req/min)"
    else trafficCapacity = "Low (<5k req/min)"

    // =========================================
    // 🔥 4. SYSTEM DESIGN GRADER
    // =========================================
    let score = 0

    if (patterns.hasAPI) score += 1
    if (patterns.hasService) score += 1
    if (patterns.hasDB) score += 1
    if (patterns.hasCache) score += 1
    if (patterns.hasQueue) score += 1

    if (!patterns.godService) score += 1
    if (!patterns.isFullySync) score += 1

    const grade =
        score >= 6 ? "A" :
            score >= 4 ? "B" :
                score >= 2 ? "C" : "D"

    // =========================================
    return {
        cost: {
            estimatedMonthlyCost,
            breakdown
        },
        latency: {
            estimatedLatency
        },
        scaling: {
            trafficCapacity,
            scalabilityScore
        },
        grading: {
            score,
            grade
        }
    }
}