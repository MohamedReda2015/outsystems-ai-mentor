---
name: outsystems-ai-mentor
description: OutSystems AI Mentor - an agent-independent, end-to-end delivery lifecycle for OutSystems 11 (O11) modelled on OutSystems Mentor (requirements, app specification, generate, validate, iterate) and run through the Service Studio MCP. Orchestrates the house skills - BRD analysis, user stories, 3-layer Canvas architecture, data model, logic, integrations, screens and style, testing and acceptance - with five gates, incremental vertical slices, an implementation review per increment, validation against requirements and acceptance criteria, and a capability matrix of what the O11 MCP can do (read GA, write Beta) versus manual work or human review. Includes an app-specification template and a workflow-state checker. Use it whenever an agent must build, extend or deliver an OutSystems 11 app or feature end to end, plan a release or resume a half-built app, even if the user only says "build this app", "generate the app from this BRD", "act like Mentor", "what's next" or "continue the build".
license: MIT
metadata:
  version: 1.3.0
  updated: 2026-11-22
  platform: OutSystems 11 (Reactive Web first; Mobile and Traditional Web noted) with the Service Studio MCP server (11.55.91+)
  agent-independent: true
  companion-skills: outsystems-brd-analysis (BR*); outsystems-user-story-implementation (RQ*); outsystems-architecture (ARC/SEC/TST...); outsystems-backend-conventions (BLG/BDA/BIN...); outsystems-frontend-conventions (FET/VAL/ERR...); outsystems-live-style-guide (TOK/LAY/FRM...); outsystems-bpt and outsystems-cmf (workflows, cases); official OutSystems skill for O11 servicestudio-mcp-oml (Model API, tool contract)
---

# OutSystems AI Mentor

**OutSystems Mentor** (ODC) builds an app in a fixed loop: it reads the requirements, proposes an **app specification** (roles, features, data model, screens, logic) that the human reviews, **generates** the app, **validates** it continuously (code quality, security, performance) and lets the team **iterate** in small prompts. Mentor itself does not run on OutSystems 11.

This skill gives an AI agent working on **O11** the same loop, with the house standards built in:
- the **agent plus the Service Studio MCP** play Mentor's generator (Model API writes, reviewed in Compare and Merge);
- **TrueChange, Code Quality (formerly AI Mentor Studio) and the review checklists** play Mentor's validator;
- the **house skills** decide *how* each piece is designed and written. This skill decides **what comes next, who does it (MCP, agent or human), and when the work may move on**.

It works for Claude Code, Codex, Copilot, Cursor, Kiro, Gemini or any custom agent, and for humans. Everything is plain Markdown plus one zero-dependency Node.js script.

## Where this skill sits

| Question | Owner |
|---|---|
| **The whole lifecycle: order, gates, increments, MCP vs manual, status, resume** | **this skill** (`MW*`, lessons `MLL-*`) |
| A whole BRD/PRD: extraction, gaps, clarification, stories, phased plan | outsystems-brd-analysis (`BR*`) |
| One story: card, clarify, plan, build, test every AC, accept | outsystems-user-story-implementation (`RQ*`) |
| Layers, modules, apps, dependencies, security, LifeTime SOPs | outsystems-architecture (`ARC`, `SEC`, `TST`…) |
| Entities, BL, IS, SQL, timers, errors, caching | outsystems-backend-conventions (`BDA`, `BLG`, `BIN`…) |
| Screens, blocks, client logic, forms, JS | outsystems-frontend-conventions (`FET`, `VAL`…) |
| Look and feel, patterns, accessibility, RTL | outsystems-live-style-guide (`LAY`, `FRM`, `TOK`…) |
| Approvals, inboxes, processes, cases | outsystems-bpt (`PDS`…), outsystems-cmf (`CAR`…) |
| The exact MCP tool calls and Model API C# | official **servicestudio-mcp-oml** skill (OutSystems/outsystems11-mcp) |

This skill never redefines a companion rule; it **cites** it and hands the step over (`MWG-01`). When a companion skill is not installed, use the short fallback in `references/skill-coordination.md` and say so.

## Precedence
1. The user's decisions in this conversation and the project's written conventions (AGENTS.md, blueprint).
2. Approved requirements: BRD/PRD, stories and acceptance criteria.
3. The house skills (architecture first for structure, the convention skills for code).
4. OutSystems official guidance (Canvas, best practices, Mentor/Code Quality patterns).

Security, data-integrity and transaction rules are never relaxed silently: flag the conflict and ask.

## The lifecycle: ten phases, five gates, increments in the middle

```
 M0 Setup ─► M1 Requirements ══G1══► M2 App Spec ══G2══► M3 Architecture ══G3══►
                                                                              │
     ┌────────────── per increment (vertical slice of features) ─────────────┘
     ▼
   M4 Data ─► M5 Logic ─► M6 Integrations ─► M7 Screens & UI ─► M8 Test & Validate ══G4══┐
     ▲                                                                                   │
     └──────────────────────── next increment ◄──────────────────────────────────────────┘
                                                                                         ▼
                                                              M9 Release & Handover ══G5══► Done
```

| Gate | Holds when | Rule |
|---|---|---|
| **G1 Requirements ready** | requirements baseline exists; no open Blocker question; Majors answered or accepted as written assumptions | `MWR-04`, `BRC-*`, `RQC-03` |
| **G2 Spec approved** | the user approved the App Specification (roles, features, data model, screens, logic, integrations, increments) | `MWP-07` |
| **G3 Architecture approved** | modules/apps on the Canvas, dependency direction valid, MCP-vs-manual plan agreed, modules exist and are open | `MWA-06` |
| **G4 Increment accepted** (each slice) | every AC of the slice Pass with evidence; TrueChange clean; implementation review done; manual steps listed | `MWT-07`, `MWV-01` |
| **G5 Release accepted** | all increments at G4, regression run, Code Quality has no new findings, deployment plan and handover approved | `MWV-06` |

"Go ahead" for one gate is not approval for the next (`MWG-04`). "Just plan it" means stop at G3.

**Workflow state** (`MWG-05`): keep `docs/mentor/` (or the project's equivalent) with `workflow-status.md` (human view) and `workflow-state.json` (machine view; `templates/workflow-state.json`). It is the single source of truth any agent, session or person resumes from. Check it at every gate:
```
node scripts/check-workflow.mjs docs/mentor/workflow-state.json [--gate G1..G5] [--json]
```

## MCP or manual: decide before every step
Read `references/mcp-capability-matrix.md` before planning; the house-wide MCP rules (governance, edit sessions, timeouts, pitfalls) are in the architecture skill's shared Service Studio MCP reference (`OPS-10`). In short (Service Studio 11.55.91+, contract 1, re-check on newer builds):

| Mark | Meaning | Examples |
|---|---|---|
| **MCP-R** | MCP read: **GA** for Reactive/Mobile, **Beta** for Traditional Web; leaves the module unchanged | module overview, `getDataModel`, `getScreen`, `getServerAction`, `getValidationMessages`, `listOpenModules`, `searchApps`, `runQuery` (ModelQL over the model, *not* the database) |
| **MCP-W** | MCP write, **Beta**, staged in Compare and Merge | entities, static entities, indexes, structures, server/service/client actions, aggregates, SQL nodes, exceptions, roles, site properties, screens, blocks, widgets, REST consume/expose, email templates, timers, BPT processes (hand-verified API) |
| **MCP-W⚠** | Beta with a known gap: verify after publish | block/screen stylesheets that are not empty, theme icon library, CORS setting, Excel export node |
| **MAN** | Human in Service Studio, Service Center, LifeTime, Users or a browser | create app/module, **add dependencies (Manage Dependencies → Apply)**, translations (export/import), Forge installs, extensions, site-property values and secrets per environment, role assignment to users, Code Quality scans, deploy between environments, real end-to-end tests |
| **REV** | Human approval needed even when the agent can do it | Compare and Merge review, publish, data-changing test steps, changes to shared modules, the App Spec, every gate |

Rules: tag every task in the increment plan with its mark (`MWG-02`); on the first write in a conversation say that MCP writes are **Beta** (`MWG-03`); never work around a MAN step: deliver the piece plus exact manual steps (`MWG-06`, `MLL-03`).

**Edit sessions and governance** (official design notes, community Ideas): the agent edits a **copy** of the module, so edits the user makes during a session are invisible to it — no human edits while a session is open, and restart the session after human edits or partial merges (`MWG-08`); sessions outlive the chat and are shared by every connected agent; reads time out at 120 s and writes at 300 s (`MWA-07`); the MCP cannot tell which **environment** a module came from and the agent inherits the developer's publish rights, while LifeTime has no MCP control — confirm the environment and keep work in Development (`MWS-06`); keep an **agent change log**, because the platform attributes changes to the developer (`MWG-09`).

### M0 — Setup and context
1. Confirm **O11** (not ODC), Service Studio version, MCP server started and authorized, the official `servicestudio-mcp-oml` skill installed and its contract matching (`MWS-01`); record the MCP contract and live tool set (`MWS-05`); if the ODC MCP server is also connected and the user named neither platform, ask which one before any call (`MWS-07`); confirm the **environment** with the user, Development only (`MWS-06`).
2. **Green-field, brown-field, extension or Traditional-to-Reactive move?** (a move uses Convert to Reactive in producer-to-consumer increments, `MWA-08`) For brown-field, read the as-is with MCP-R: open modules, `searchApps`, data model, screens, roles, dependencies; open consumer modules yourself (the dependency map covers the open module only) (`MWS-02`, `RQA-02`).
3. Record the platform context: app and module names, theme and layout to reuse, locales, roles, shared modules that need approval (`MWS-03`).
4. Sanitize inputs: no real personal data or secrets in prompts or default values; the agent can read secret site-property defaults (`MWS-04`, `RQA-18`).
5. Create the workflow-state folder from `templates/`, with the agent change log (`MWG-05`, `MWG-09`); for brown-field, record the Code Quality and TrueChange baseline (`MWV-07`).

### M1 — Requirements (G1)
- A whole BRD/PRD, epic set or backlog → run **outsystems-brd-analysis** to its clarification gate. One story or a small set → **outsystems-user-story-implementation** Phases 0–3 (`MWR-01`).
- Output a **requirements baseline**: objectives, actors→roles, features, business rules with IDs, statuses and transitions, data, integrations, notifications, audit, NFRs, acceptance criteria — each with a source (`MWR-02`).
- Unknowns stay `TBC`; never invent business data (`MWR-03`, `RQC-05`). Stop at G1 with one batched list of Blocker/Major questions, each closed with a recommendation (`MWR-04`).

### M2 — App Specification (G2): Mentor's "review before generate" step
Fill `templates/app-specification.md` (`references/app-specification.md`):
1. **Personas → roles** and what each may see and do (`MWP-01`).
2. **Feature map**: features → stories → ACs, MoSCoW, process step (`MWP-02`).
3. **Logical data model**: entities, attributes, types, relationships, static vs user-maintained lookups, audit columns, soft delete, volumes, sample data needs (`MWP-03`).
4. **Screen inventory**: screen, purpose, role, entry point, pattern, blocks, states; navigation map (`MWP-04`).
5. **Logic inventory**: use cases, rules, state machine (once for the app), async steps with mechanism (timer, Light BPT, BPT, CMF, outbox) (`MWP-05`, `PDS-01`).
6. **Integrations and NFRs**: systems, direction, failure behaviour; security, performance, accessibility, languages/RTL (`MWP-06`).
7. **Increments**: thin vertical slices, each usable and testable, foundation first (`MWP-08`, `references/incremental-delivery.md`).
Run the spec check — every screen has a defined role, every role is used, entities listed, missing relationships or integrations flagged (`MWP-09`) — then show a one-page summary first, details on request; wait for approval (`MWP-07`).

### M3 — Architecture (G3)
Hand over to **outsystems-architecture**: Canvas layer per module, house chain Front_End → CW → BL → CS (+ `_IS`, `_Th`, `_Lib`), apps and owners, no upward or side references, Reactive security (`MWA-01`…`MWA-03`, `ARC-*`). Validate the dependency list with the architecture skill's validator.
Then plan the **manual** setup the MCP cannot do: create apps/modules, set module types, add dependencies, install Forge components, theme base, a test module/app kept out of Production (`MWA-04`, `MWT-09`). Check MCP feasibility of every existing module you will touch; very large ones need a plan (`MWA-07`). Produce `templates/architecture-design.md` and the MAN step list; G3 holds only when the modules exist, are open, and `eSpace.References` show the dependencies (`MWA-05`, `MWA-06`, `MLL-02`).

### Per increment: M4 → M8 (G4)
Plan the slice with `templates/increment-plan.md`: tasks per layer, each with module, element, mark (MCP-R/MCP-W/MAN/REV), story/AC IDs and a done check. **Get the plan approved before the first write** — Mentor's implementation-plan sign-off (`MWG-10`). Build bottom-up; read back after every write (`MWG-07`); lay out new or changed flows before merging (`MWG-11`); log merges and publishes (`MWG-09`).

| Phase | Do | Follow | Own rules |
|---|---|---|---|
| **M4 Data** | CS entities (Public, Expose Read-Only), Id/AutoNumber, FKs with delete rules, indexes, static vs lookup entities, CRUD wrappers, idempotent seed/ensure actions | backend `BDA-*`, architecture `DAT-*` | `MWD-01`…`MWD-05` |
| **M5 Logic** | BL Structures, thin Service Actions over private `_Logic`, authorize → validate → act → map, state transitions with history in one transaction, user exceptions, roles; processes via BPT/CMF | backend `BLG-*`, `BTX-*`; `SEC-01`; bpt/cmf | `MWL-01`…`MWL-05` |
| **M6 Integrations** | `_IS` wrapper per system, timeouts, normalized errors, per-environment config, mock point; prove with a real call | backend `BIN-*`, `BSC-03` | `MWI-01`…`MWI-04` |
| **M7 Screens & UI** | CW blocks with data actions and loading/empty/error states, server-computed `Can*` flags; Front_End screens on the existing layout, roles on every screen, menu, theme and patterns | frontend `FET-*`, `FSC-*`; style guide `LAY-*`, `FRM-*` | `MWU-01`…`MWU-06` |
| **M8 Test & Validate** | TrueChange clean; one test per AC plus negatives and roles on published code; BDDFramework for BL rules in a test module (pyramid); Code Quality scan, security first; requirements coverage; implementation review | user-story `RQT-*`; architecture `TST-*` | `MWT-01`…`MWT-09`, `MWV-01`, `MWV-07` |

The **implementation review** (`templates/increment-review.md`, `references/reviews-and-validation.md`) closes every increment: requirements coverage (feature → story → AC → element → test), a two-axis code review — Standards and Spec kept apart (`MWV-08`) —, standards (each companion checklist), MCP hygiene (all merges reviewed, nothing unpublished left behind), open MAN steps, and lessons. Then G4.

### M9 — Release and handover (G5)
Regression across increments; Code Quality scan with no new findings versus the baseline (MAN); performance and security checks; translations imported (MAN); deployment plan via LifeTime with order, dependencies, site properties and roles per environment, test apps excluded, no more TrueChange warnings than the last release, hotfixes only through Development (MAN, REV); `templates/release-acceptance.md` with the AC matrix and the manual-step list. Say "done" only when G5 holds (`MWV-02`…`MWV-06`).

## Rules most often broken
- Generating screens before the spec and the data model are approved (`MWP-07`, `MLL-01`).
- Assuming a dependency exists because the user said "added" — not applied, or not visible until the edit session restarts (`MWA-05`, `MLL-02`).
- Building through MCP what is MAN (translations, dependencies, secrets) or inventing a workaround (`MWG-06`).
- Big-bang build of every entity and screen, then testing at the end (`MWP-08`, `MLL-04`).
- "Merged" reported as "deployed"; CSS changes that never shipped (`MWT-02`, `MLL-05`).
- Treating MCP's AI summaries of a module as facts without reading the element (`MWS-02`).
- Increments closed without an implementation review or with ACs never run (`MWV-01`, `MWT-07`).
- Approval for one gate treated as approval for publish or deploy (`MWG-04`).
- Human edits made while the agent's edit session is open — the agent never sees them and may overwrite them (`MWG-08`, `MLL-17`).
- Assuming the open module is in Development; no record of what the agent changed (`MWS-06`, `MWG-09`).
- Code Quality run only before release (`MWV-07`).
- Workflow state kept only in the chat, so the next session starts from zero (`MWG-05`).

## Reference map (read only what the task needs)
| File | Read when |
|---|---|
| `references/mentor-approach.md` | what OutSystems Mentor does, and how each Mentor stage maps to O11 + MCP + house skills |
| `references/workflow-phases.md` | the detailed checklist, inputs, outputs, MCP calls and manual steps of each phase M0–M9 |
| `references/mcp-capability-matrix.md` | deciding MCP-R / MCP-W / MCP-W⚠ / MAN / REV for any task; known gaps; contract/version checks |
| `references/app-specification.md` | writing or reviewing the App Specification (G2) |
| `references/incremental-delivery.md` | slicing features into increments, ordering, rework, change requests, resuming |
| `references/reviews-and-validation.md` | implementation reviews, requirements/AC validation, TrueChange and Code Quality, evidence |
| `references/skill-coordination.md` | which companion skill owns which step, hand-off contracts, fallbacks when a skill is missing |
| `references/agent-portability.md` | running the workflow in Claude Code, Codex, Copilot, Cursor, Kiro or a custom agent |
| `references/lessons-learned.md` | before any real build (`MLL-*`) |
| `references/review-checklist.md` | rule definitions (all `MW*` IDs); reviewing someone else's delivery |
| `templates/*` | workflow status and state, app specification, architecture design, increment plan and review, manual steps, release acceptance |
| `scripts/check-workflow.mjs` | checking `workflow-state.json` at a gate: order, approvals, plan sign-off, coverage, marks, manual-step owners, change log, Mentor Studio |
| `examples/leave-requests/walkthrough.md` | a fictional end-to-end example through every phase and gate |
| `research/sources.md` · `research/assessment-2026-11.md` | where the rules come from, and what the November 2026 research changed |

## Output style
- Talk in the user's language; keep business terms and labels exactly as the requirements write them.
- Start each turn with **where we are** (phase, gate, increment) and **what's next**; long artifacts go to files.
- Mark every planned step MCP-R / MCP-W / MAN / REV; cite rule IDs; never claim a step you did not run or a deploy you did not see.
