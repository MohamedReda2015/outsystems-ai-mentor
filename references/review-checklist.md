# Review checklist — rule definitions

Every rule of this skill is defined here, once. IDs are stable: new rules get new numbers, retired numbers are never reused.
Severity: **Blocker** (the work can't pass the next gate), **Major** (fix before the gate or record an accepted exception), **Minor** (fix or record).
"Check" says where the evidence comes from: *state* (workflow-state.json / status file), *artifact* (spec, plan, review, report), *model* (MCP read-back or Service Studio), *app* (running app), *script*.

Use it three ways: as the agent's self-check at each gate; to review someone else's workflow; to write findings as `ID — evidence — fix`.
Companion rules (`BR*`, `RQ*`, `ARC`, `SEC`, `BDA`, `BLG`, `FET`, `LAY`…) are defined in their own skills; this file only adds the lifecycle rules.

## MWS — Setup and context (M0)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWS-01 | Blocker | Platform and tooling confirmed before any write: O11, Development environment, Service Studio version, MCP server started and authorized, official servicestudio-mcp-oml skill installed with a matching contract | state, model |
| MWS-02 | Blocker | For brown-field work the as-is is read first (MCP-R): modules, data model, screens, roles, dependencies, consumers; AI-generated summaries are confirmed by reading the element itself before the design relies on them | artifact, model |
| MWS-03 | Major | Platform context recorded: app and module names, module types, theme/layout to reuse, locales, roles, shared modules that need approval | state |
| MWS-04 | Blocker | No real personal data or secrets in prompts, requirements copies, sample data or module default values; secret site-property defaults are empty | artifact, model |
| MWS-05 | Major | The live tool list is checked and the build's tool set recorded (early contract 1 `listApps`; later `listOpenModules` + `searchApps`; later still `openModule`/`closeModule`); where a live tool description differs from the official skill, the description wins | state, model |
| MWS-06 | Blocker | The target environment is confirmed with the user (and `searchApps` where available), because the MCP does not report which environment an open module came from and the agent inherits the developer's publish rights; agent work is limited to Development by explicit agreement | state |
| MWS-07 | Major | When both the O11 (Service Studio) and ODC MCP servers are connected and the request names neither platform, ask which one before any OutSystems call, read-only included (`RQI-13`) | state |

## MWR — Requirements (M1, G1)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWR-01 | Major | Requirements are analysed by the right companion: whole BRD/epic set → brd-analysis; single story or small set → user-story-implementation; the choice is recorded | state |
| MWR-02 | Blocker | A requirements baseline exists: objectives, actors→roles, features, rules with IDs, statuses/transitions, data, integrations, notifications, audit, NFRs, acceptance criteria, each traced to a source | artifact |
| MWR-03 | Blocker | Unknown business data stays `TBC` and is listed; nothing plausible is invented | artifact |
| MWR-04 | Blocker | G1: no open Blocker question; every Major answered or covered by a written assumption the user accepted | state |

## MWP — App Specification (M2, G2)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWP-01 | Major | Personas are mapped to platform roles with what each may see and do, including who must not | artifact |
| MWP-02 | Blocker | Feature map: every feature lists its stories and ACs with priority; every Must AC belongs to a feature | artifact, script |
| MWP-03 | Blocker | Logical data model: entities, attributes, types, relationships and delete behaviour, static vs user-maintained lookups, audit columns, soft delete, volumes | artifact |
| MWP-04 | Major | Screen inventory and navigation map: screen, purpose, roles, entry point, pattern, blocks, states | artifact |
| MWP-05 | Major | Logic inventory: use cases, rules, one state machine for the app, a named mechanism for every asynchronous or "System" step | artifact |
| MWP-06 | Major | Integrations (system, operation, direction, failure behaviour, test environment) and NFRs (security, performance, accessibility, languages/RTL) are stated | artifact |
| MWP-07 | Blocker | G2: the user approved the App Specification (summary first, details on request) before any model write beyond M3 setup | state |
| MWP-08 | Major | Delivery is split into thin vertical increments, each usable and testable on its own, foundation first, risk early | artifact, script |
| MWP-09 | Major | Spec check before G2: every screen names at least one role the spec defines; every defined role is used by a screen or use case; entities are listed; missing relationships or integration details are flagged | artifact, script |

## MWA — Architecture (M3, G3)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWA-01 | Blocker | Every module is placed on the 3-layer Canvas and follows the house chain Front_End → CW → BL → CS (+ _IS, _Th, _Lib) per outsystems-architecture | artifact, script |
| MWA-02 | Blocker | No upward or side references between modules; no cycles; End-User modules expose nothing | artifact, script |
| MWA-03 | Major | Apps are grouped by owner and release cadence; shared modules and their owners are named | artifact |
| MWA-04 | Major | Every setup step the MCP cannot do (create app/module, module type, dependencies, Forge, theme base, extensions) is in the manual-steps list with an owner | artifact, state |
| MWA-05 | Blocker | Dependencies are verified by reading `eSpace.References` (after restarting the edit session) before any element uses them; "I added it" is not evidence | model |
| MWA-06 | Blocker | G3: architecture design approved; modules exist and are open; dependencies verified; MCP-vs-manual plan agreed | state |
| MWA-07 | Major | MCP feasibility per module is checked in M3: very large modules (reads time out at 120 s, writes at 300 s) get a plan — raised timeouts and script calls, a read-only snapshot for analysis, or new logic in a small module the user wires in by hand | artifact |

## MWD — Data model (M4)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWD-01 | Blocker | Entities live in CS, are Public with Expose Read-Only, and are written only through CS/BL actions; regular entities have an auto-number identifier, **static entities do not** (their ids must be identical in every environment, backend `BDA-14`) | model |
| MWD-02 | Major | Foreign keys have an explicit delete rule; indexes exist for filters, sorts and uniqueness the spec names | model |
| MWD-03 | Major | Lists the business maintains are entities with an admin path; static entities only for values code depends on | model, artifact |
| MWD-04 | Major | Audit columns and soft delete follow the spec; seed and reference data come from idempotent ensure actions, verified after publish | model, app |
| MWD-05 | Minor | Data-model elements are in named folders; read-back after every write matches the spec | model |

## MWL — Business logic (M5)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWL-01 | Blocker | Use cases are BL actions that authorize → validate → act → map; every rule is enforced on the server | model |
| MWL-02 | Major | Service Actions are thin wrappers over private `_Logic` Server Actions; multi-step writes share one transaction | model |
| MWL-03 | Blocker | State transitions go through one action per transition and write history in the same transaction | model |
| MWL-04 | Major | Errors use user exceptions with business messages; unexpected errors are logged, not shown raw | model |
| MWL-05 | Major | Asynchronous steps use the mechanism chosen in the spec (timer, Light BPT, BPT, CMF, outbox) and are idempotent | model, artifact |

## MWI — Integrations (M6)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWI-01 | Major | One `_IS` wrapper per external system with timeouts, normalized errors and a mock point | model |
| MWI-02 | Blocker | Every integration is proven with a real call to the target test environment before logic is built on it | app, artifact |
| MWI-03 | Blocker | Endpoints, credentials and keys are per-environment configuration; the agent never types or copies secrets | model, artifact |
| MWI-04 | Major | Exposed APIs have authentication, input validation and a documented contract | model |

## MWU — Screens and UI (M7)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWU-01 | Major | Business UI lives in CW blocks; Front_End screens compose blocks on the existing layout | model |
| MWU-02 | Blocker | Every screen has roles set; buttons hidden by role are also checked on the server | model |
| MWU-03 | Major | Data actions/aggregates fetch only what the screen shows; loading, empty and error states exist | model, app |
| MWU-04 | Major | Forms validate on client and server, guard double submit and confirm destructive actions | app |
| MWU-05 | Major | Theme, patterns, spacing and colours follow the style guide; no inline styles where a class exists | model, script |
| MWU-06 | Major | Labels, messages and statuses exist in every required language; RTL works; translations are imported by hand | app |

## MWT — Test and validate (M8, G4)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWT-01 | Blocker | `getValidationMessages` shows no errors and no new warnings in any module touched | model |
| MWT-02 | Blocker | Publish state is stated (merged vs published vs deployed); tests run only on published code after a cache-clearing reload; CSS changes verified by fetching the served file | state, app |
| MWT-03 | Blocker | One test per acceptance criterion from its Given/When/Then, plus the negative set (no role, another user's record, wrong state, invalid input, double submit, integration failure) | artifact |
| MWT-04 | Major | Every role's full journey is walked, including the return to the entry point | app |
| MWT-05 | Major | Data effects are checked, not only screens: status, history, audit, notifications, nothing written on failure | app, model |
| MWT-06 | Major | BL rules have automated component tests (BDDFramework) where the plan says so; impacted existing tests re-run | artifact |
| MWT-07 | Blocker | G4: every AC of the increment is Pass with evidence, or Fail/Blocked/Not tested with reason and owner, and the increment review is done | state, script |
| MWT-08 | Major | Defects get an ID, a fix and a re-test; ACs touched by the fix are re-run | artifact |
| MWT-09 | Major | Automated tests follow the test pyramid (many BL/API tests, few UI journeys) and live in a dedicated test module or app (BDDFramework or equivalent) that is never deployed to Production; actions needing test access are exposed only there | artifact, model |

## MWV — Review, release and handover (G4, M9, G5)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWV-01 | Blocker | Each increment ends with an implementation review: requirements coverage, standards per companion checklist, MCP hygiene, open manual steps, lessons | artifact |
| MWV-02 | Major | Regression across all increments passes before release | artifact |
| MWV-03 | Major | AI Mentor Studio scan (manual) shows no new findings, or each new finding has an accepted exception | artifact |
| MWV-04 | Major | Deployment plan lists order, dependencies, site properties, roles, translations and data scripts per environment; deploys go through LifeTime by a human | artifact |
| MWV-05 | Major | Handover lists every manual step, configuration value, test user and test data created, plus follow-ups | artifact |
| MWV-06 | Blocker | G5: all increments at G4, regression passed, release acceptance approved by the user | state, script |
| MWV-07 | Major | AI Mentor Studio analysis is recurrent (at least per increment once the code is in Development, not only before release); findings are fixed in the order Security → Performance → Architecture → Maintainability, including deprecated-element findings; trend recorded per increment | artifact, state |
| MWV-08 | Major | The increment review's code review runs two independent axes — Standards (code vs companion checklists, without the story) and Spec (each AC Met / Partly met / Not found / Needs testing, citing element › node) — with out-of-scope changes reported and pre-existing debt kept apart (`RQT-12`) | artifact |

## MWG — Governance, MCP and coordination (all phases)

| ID | Severity | Rule | Check |
|---|---|---|---|
| MWG-01 | Major | Each step is done by the companion skill that owns it; this skill cites, never redefines, companion rules | artifact |
| MWG-02 | Major | Every planned task carries a mark: MCP-R, MCP-W, MCP-W⚠, MAN or REV | state, script |
| MWG-03 | Major | MCP writes: first write of a conversation states the Beta status; writes are reviewed in Compare and Merge; one call per module at a time; Development only | artifact |
| MWG-04 | Blocker | Approval is per gate and per action: publish, deploy, merges into shared modules and data-changing test steps each need an explicit yes | state |
| MWG-05 | Major | Workflow state (status file + state JSON) is kept current at every gate and increment; it is enough to resume without the chat | state, script |
| MWG-06 | Blocker | A step the MCP cannot do is delivered as a piece plus exact manual steps with an owner; no workaround that bypasses the platform | artifact |
| MWG-07 | Major | After every write: check the exception message and validation errors, read the element back, fix what you introduced before the next write | model |
| MWG-08 | Major | Edit-session discipline: the agent edits a copy, so nobody edits that module in Service Studio while the session is open; after human edits, a rejected or partial merge, end the session and start a new one; sessions outlive the conversation and are shared by every connected agent; work to keep is copied out before Service Studio restarts | model, state |
| MWG-09 | Major | An agent change log is kept (module, change, merge time, published version) because the platform attributes agent changes to the developer | state |
| MWG-10 | Major | Each increment plan is shown and approved before its first model write — the O11 equivalent of signing off Mentor's implementation plan | state, script |
| MWG-11 | Major | Every flow the agent created or changed is laid out (the official completion gate) before `omlMerge` | model |
