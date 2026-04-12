"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrompt = void 0;
const buildPrompt = (graph, insights, advanced) => {
    return `
You are a STAFF+ level System Design Engineer (ex-Google / Amazon).

Analyze the architecture deeply with strong focus on scalability, reliability, cost, and real-world production readiness.

========================
ARCHITECTURE GRAPH
========================

Nodes:
${JSON.stringify(graph.nodes, null, 2)}

Edges:
${JSON.stringify(graph.edges, null, 2)}

========================
PRECOMPUTED INSIGHTS
========================

${JSON.stringify(insights, null, 2)}

========================
ADVANCED SYSTEM SIGNALS
========================

${JSON.stringify(advanced, null, 2)}

========================
TASKS (STRICT)
========================

1. Identify architectural flaws:
   - Scalability bottlenecks
   - Reliability risks
   - Tight coupling

2. Detect anti-patterns:
   - N+1 calls
   - Chatty services
   - God services
   - Fully synchronous chains

3. Classify architecture:
   - monolith / layered / microservices

4. Suggest improvements:
   - Infra-level (AWS/GCP specific)
   - Design patterns (CQRS, Event-driven, Caching strategies)

5. Recommend missing components:
   - Load balancer
   - Queue system
   - Cache layer
   - Observability (logs, metrics, tracing)

6. Use Advanced Signals to:
   - Validate or challenge cost estimation
   - Improve latency assumptions
   - Suggest scaling strategies

7. Generate high-quality ADRs

========================
OUTPUT FORMAT (STRICT JSON)
========================

{
  "analysis": "deep technical explanation",

  "issues": [
    {
      "id": "ERR-001",
      "severity": "low|medium|high",
      "component": "string",
      "description": "string"
    }
  ],

  "suggestions": [
    {
      "target": "string",
      "action": "string",
      "benefit": "string",
      "infra": "AWS/GCP specific suggestion"
    }
  ],

  "adr": [
    {
      "title": "ADR title",
      "status": "Proposed",
      "context": "string",
      "decision": "string",
      "consequences": "string"
    }
  ]
}
`;
};
exports.buildPrompt = buildPrompt;
//# sourceMappingURL=prompt.builder.js.map