"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrompt = void 0;
const buildPrompt = (graph, insights) => {
    return `
You are a senior staff-level system design reviewer.

Analyze the given architecture deeply with production-level thinking.

========================
ARCHITECTURE GRAPH
========================

Nodes:
${JSON.stringify(graph.nodes, null, 2)}

Edges:
${JSON.stringify(graph.edges, null, 2)}

========================
PRE-COMPUTED INSIGHTS
========================
${JSON.stringify(insights, null, 2)}

========================
ANALYSIS INSTRUCTIONS
========================

You must evaluate:

1. Architecture Style
- Identify if it is monolith, layered, microservices, event-driven, etc.

2. Data Flow & Coupling
- Identify tight coupling, direct dependencies, bad layering
- Detect if API Gateway is overloaded

3. Scalability
- Detect sync bottlenecks
- Identify missing async boundaries
- Evaluate cache usage

4. Reliability
- Detect single points of failure
- Analyze cascading failure risks

5. Performance
- Analyze latency paths
- Identify potential bottlenecks

6. Missing Components
- Queue, load balancer, monitoring, retries, etc.

7. Best Practices Violations
- Separation of concerns
- Improper access patterns

========================
OUTPUT FORMAT (STRICT JSON)
========================

{
  "analysis": "High-level architectural summary",
  "issues": [
    {
      "id": "ERR-XXX",
      "severity": "low | medium | high",
      "component": "Component name",
      "description": "Clear explanation of the issue"
    }
  ],
  "suggestions": [
    {
      "target": "Component",
      "action": "What to change",
      "benefit": "Why it improves system"
    }
  ],
  "adr": [
    {
      "title": "ADR title",
      "status": "Proposed",
      "context": "Why decision is needed",
      "decision": "What is chosen",
      "consequences": "Tradeoffs"
    }
  ]
}
`;
};
exports.buildPrompt = buildPrompt;
//# sourceMappingURL=prompt.builder.js.map