# Plutofy AI — Technical Overview

A full-stack, end-to-end TypeScript platform for building and executing AI agents and workflow automations. Visual node editor on the frontend, graph executor on the backend, with a shared declarative scheme that drives both rendering and execution.

**Stack:** TypeScript everywhere · React + Vite + Tailwind + shadcn/ui · React Flow (`@xyflow/react`) · Express · Mongoose/MongoDB · LangChain + LangGraph · Clerk auth · Zod v3 *and* v4 (dual-imported) · React Query · Vercel + (Heroku-style) Procfile deploy.

---

## Architecture at a glance

```
┌──────────────────────┐         ┌──────────────────────┐
│  React Flow canvas   │──HTTP──▶│   Express API        │
│  (visual builder)    │         │   ├ /workflow CRUD   │
│  ├ node sidebar      │         │   ├ /webhook trigger │
│  ├ JSON struct       │         │   ├ /credentials     │
│  │  builder          │         │   └ /agent (mgd)     │
│  └ template editor   │         │                      │
└──────────┬───────────┘         │   Graph executor     │
           │                     │   ├ execute-workflow │
           │ shared              │   ├ execute-node     │
           ▼                     │   └ per-node modules │
   workflow-scheme.ts ───────────┤   (agent, webhook,   │
   (single source of truth)      │    email, telegram)  │
                                 └──────────┬───────────┘
                                            ▼
                                  ┌──────────────────┐
                                  │  MongoDB         │
                                  │  Workflows /     │
                                  │  Webhooks /      │
                                  │  Credentials     │
                                  └──────────────────┘
```

---

## Engineering highlights

### 1. A workflow scheme as the single source of truth
`workflow-scheme.ts` declaratively defines every node type — name, image, category (`trigger | action | child`), required `credentials[]`, and `data[]` fields. The same file is consumed by:
- the React Flow sidebar to render config UIs (`NodeDataEditor`, `NodeCredentialsEditor`),
- the validator (`WorkflowValidator.isNodeConfigCorrect`) that paints misconfigured nodes red,
- the executor (`execute-node.ts`) that pulls field structures to build runtime schemas.

Adding a new node type is a single declaration plus a small executor — no UI/back-end drift.

### 2. Dynamic Zod schema generation at runtime
`generateDynamicZodV4Schema.ts` takes user-defined `OutputStructure[]` trees (string / number / boolean / object / array, arbitrarily nested) and emits a real Zod schema recursively. Used in two load-bearing places:
- **Credential & data parsing** — every node reads through `ExecutionHelper.getDataFromNode` / `getCredentials`, which `parse()`s through the dynamic schema. Invalid runtime data fails fast at the boundary, no manual validation per node.
- **Structured LLM output** — passed directly to LangGraph's `createReactAgent({ responseFormat: schema })`, so the LLM is constrained to emit JSON matching the user's UI-defined shape. The user designs the agent's output schema visually; the runtime enforces it.

### 3. Graph executor with typed edges
`execute-workflow.ts` walks the DAG starting from the trigger node, threading an execution `history` through. Connections carry semantics:
- default edges = normal flow (`getNextNodesId` filters to non-`child`),
- `type: "child"` + `sourceHandle: "llm" | "tool"` = sub-component attachments to an `agentNode`.

That distinction lets the visual editor (`isValidConnection` on the canvas) enforce that LLM nodes only attach to agents, and lets `AgentExecutionHelper.getAllToolNodes` / `getLlmNode` resolve the agent's children deterministically.

### 4. Pluggable agent + tool registry
The AI Agent node is built on `@langchain/langgraph`'s `createReactAgent`. At execution time it:
1. Resolves the attached LLM node, looks up provider credentials, instantiates a model via `AgentService.getModel` (provider-pluggable switch).
2. Resolves attached tool nodes, maps each to a `DynamicStructuredTool` from a registry (`AgentService.tools`).
3. Generates the structured response schema from the user's `outputStructure`.
4. Runs `agent.invoke` with a template-parsed prompt.

Adding a new tool is one entry in the tool registry plus a node declaration.

### 5. Template variable system between nodes
Users wire data forward using `{{path.to.field}}` syntax. Two sides:
- **Frontend** (`Templater`) extracts variables from text, validates each against the *previous node's* `outputStructure`, and renders inline pills (valid/invalid styling) inside the text editor.
- **Backend** (`parseTemplate` via `json-templates`) does the actual substitution at execution time against the previous node's emitted data.

This means non-technical users get autocomplete-style feedback on data flow before they ever run the workflow.

### 6. Webhooks as a first-class trigger
Webhook trigger nodes are externalized:
- Adding a `webhookTriggerNode` creates a `Webhook` document and stores `webhookId` in the node's data.
- `/webhook/:id` accepts both `GET` and `POST`; the POST body is parsed through the node's user-defined input schema before kicking off execution.
- Deleting the node from the canvas removes the DB row (handled in `onNodesChange`).

That turns any workflow into a callable HTTP endpoint — the "on-demand execution" capability the README leads with.

### 7. Live editing without spamming the database
The canvas auto-syncs with Mongo via a `lodash.throttle`'d 2s trailing call, and the local React Query cache is optimistically updated via `queryClient.setQueryData` before the network round-trip. The cleanup hook cancels in-flight throttled calls on unmount.

### 8. Recursive JSON structure builder
`JsonInput.tsx` is a recursive React component that lets users define arbitrarily nested object/array schemas with type pickers, expand/collapse state, and a live JSON preview (`JsonPreview` rendered from `OutputStructureBuilder.getJsonObjectForPreview`). The same structure is what feeds the runtime Zod generator — UI and runtime share one tree representation.

### 9. Dual Zod versions for ecosystem compatibility
`package.json` aliases:
```json
"zod3": "npm:zod@3",
"zod4": "npm:zod@4"
```
v4 is used for our own runtime schemas; v3 is kept for the OpenAI structured-output path (`generateDynamicZodV3Schema`) that expects the older API surface. A small but real example of pinning to library realities rather than fighting them.

### 10. Auth + multi-tenancy
Clerk middleware on every protected route. Every Mongo query (workflows, credentials, webhooks) is scoped by `userId` extracted from `getAuth(req)` — no shared-tenant data path exists.

---

## Product thinking

- **Two products, one platform.** Managed Agents (callable via API key) and Workflows (visual + webhook-triggered) share infrastructure (schemas, model layer, structured output). Managed Agents are currently paused, but the surface returns a thoughtful `503` with a `Retry-After` header and a redirect message — degraded gracefully instead of removed.
- **Structured output is the integration story.** The pitch isn't "another agent builder" — it's that *you define the JSON shape your code expects*, and the runtime guarantees it. That makes outputs directly consumable by callers without parsing prose.
- **Webhooks make workflows real APIs.** Any workflow with a webhook trigger is a `GET`/`POST` endpoint. Users build automations; developers call them like microservices.
- **Visible data flow lowers the learning curve.** Template variable autocomplete validated against the upstream node's schema means users see *why* something is or isn't a valid reference, before they hit run.
- **Real-time validation, not post-hoc errors.** Misconfigured nodes paint red on the canvas and a banner appears on the toolbar — surfaced where you're already looking.
- **Templates as onboarding.** `WorkflowTemplates` and `AgentTemplatesSection` give first-time users working examples instead of an empty canvas.

---

## Notable trade-offs and what I'd improve next

- **Execution is currently fire-and-forget.** `executeWorkflow` returns `void` and runs branches with `.map(async … )` without `Promise.all`. Fine for short triggers; would need a job queue (BullMQ / Temporal) and an execution log model for visibility, retries, and long-running runs.
- **Workflow body validation is TODO'd.** Routes accept the workflow body as-is and rely on Mongoose. The same dynamic Zod machinery could validate the workflow doc itself.
- **Tool registry is a flat object.** Works for two tools; would benefit from a small interface (`registerTool(type, factory)`) once node count grows.
- **No structured logging / tracing.** `console.log` is the current observability story — the obvious next step is OpenTelemetry around `executeWorkflow` / `executeNode` for per-node spans.

These are the kinds of decisions I made consciously to ship the v1 surface area, not oversights.
