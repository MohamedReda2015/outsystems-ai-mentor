# Workflow phases M0–M9 in detail

Each phase lists: **inputs**, **steps** (with the mark MCP-R / MCP-W / MAN / REV), **outputs**, **exit check**, and the **companion skill** that owns the "how". Update `workflow-state.json` and `workflow-status.md` at the end of every phase (`MWG-05`).

---

## M0 — Setup and context
**Inputs**: the user's request, any documents, access to Service Studio.
**Steps**
1. Ask or confirm: O11 or ODC? Which environment (must be Development for writes)? Which app(s)? Green-field, brown-field, or extension of an existing feature? (`MWS-01`)
2. Tooling check (MCP-R): MCP server started by the user (Edit > MCP Server; `ConnectionRefused` = not started) and the connection approved; contract number and live tool set noted (`listApps` vs `listOpenModules`/`searchApps` vs `openModule`) (`MWS-05`); official skill version noted. If the ODC MCP server is also connected and the user named neither platform, ask which one before any call (`MWS-07`). If the server is down, say so and continue with analysis only.
3. Environment (`MWS-06`): ask which environment the open modules come from (the MCP cannot tell; `searchApps` names it where available) and agree that agent work stays in Development, because the agent inherits the developer's publish rights.
4. Brown-field discovery (MCP-R): `searchApps` for the app list; for each relevant module, module overview, `getDataModel`, screen names, roles, site settings, timers, integrations; dependency map. Open consumer modules for impact (`MWS-02`).
5. Record the context: module names and types, theme and layout, locales, roles, shared modules and owners (`MWS-03`).
6. Privacy: replace personal data in documents with placeholders; never repeat secrets (`MWS-04`).
7. Create `docs/mentor/` from the templates, including the agent change log (`MWG-09`).
8. Brown-field baseline: ask for the current AI Mentor Studio findings and TrueChange warning count, so later scans can be compared (`MWV-07`).
**Outputs**: `workflow-status.md` (phase M0 done), context section of `workflow-state.json`, as-is notes.
**Exit**: the agent can name the platform, the environment, the modules in scope and what already exists.

## M1 — Requirements → G1
**Owner**: outsystems-brd-analysis (whole BRD) or outsystems-user-story-implementation (stories).
**Steps**
1. Pick the companion and record the choice (`MWR-01`).
2. Run it to its clarification gate. Import its glossary, register IDs and answered questions; never re-ask.
3. Produce the requirements baseline (`MWR-02`): feature list with story and AC IDs, rule IDs, status list, role list, integration list, NFRs, each with a source.
4. One batched question list (Blockers and Majors), closed questions with recommendations (`MWR-04`).
**Outputs**: requirements baseline, clarification log, glossary.
**Exit = G1**: no open Blocker; Majors answered or accepted assumptions.

## M2 — App Specification → G2
**Owner**: this skill (`references/app-specification.md`), drawing on the companion outputs.
**Steps**: fill `templates/app-specification.md` sections 1–9 (`MWP-01`…`MWP-06`), propose increments (`MWP-08`), run the spec check (`MWP-09`: screens ↔ roles, entities, relationships, integrations; `check-workflow.mjs --gate G2` checks it when `roles` and `screens` are in the state), then present a one-page summary: roles, features per increment, entity list, screen list, key rules, integrations, risks, MAN steps expected.
**Exit = G2**: explicit approval of the spec (`MWP-07`). Changes after G2 go through a change request (`references/incremental-delivery.md` §5).

## M3 — Architecture → G3
**Owner**: outsystems-architecture.
**Steps**
1. Module map: Canvas layer, house chain per domain, `_IS`/`_Th`/`_Lib`, apps and owners (`MWA-01`, `MWA-03`).
2. Dependency list (producer → consumer); validate it with the architecture skill's validator (`MWA-02`).
3. Reuse check (MCP-R): existing CS/BL/IS modules for the same concepts before creating new ones.
4. Manual setup list (MAN) with owners: create apps and modules, module types, add dependencies and Apply, Forge components, theme base, site properties (`MWA-04`). Write it into `templates/manual-steps.md`.
5. After the human finishes: restart the edit session, probe `eSpace.References` per module, report what is missing (`MWA-05`).
6. MCP feasibility per module (`MWA-07`): try a cheap read on each existing module; for modules that time out, plan raised timeouts, a read-only snapshot for analysis, or a small companion module for new logic.
7. Test module/app for automated tests (e.g. `<D>_Tests` with BDDFramework), excluded from Production deployments (`MWT-09`).
**Outputs**: `architecture-design.md`, manual-steps list, verified references.
**Exit = G3**: design approved, modules open, references verified (`MWA-06`).

## Increment loop: M4 → M8 → G4
Plan with `templates/increment-plan.md`: scope (features, stories, ACs), tasks per layer with module, element, mark, AC IDs, done check; test plan per AC; manual steps; risks. **Show the plan and get approval before the first write** — the O11 equivalent of Mentor's implementation-plan sign-off (`MWG-10`).

Edit-session discipline for the whole increment (`MWG-08`): agree that nobody edits the module in Service Studio while the agent's session is open; after a human edit or a partial merge, end and restart the session; log every merge and publish in the agent change log (`MWG-09`); lay out every new or changed flow before merging (`MWG-11`).

### M4 — Data model
**Owner**: outsystems-backend-conventions (data access), outsystems-architecture (data rules).
1. (MCP-W) Entities in `_CS`, attributes, identifier, FKs with delete rules, indexes, folders (`MWD-01`, `MWD-02`, `MWD-05`).
2. (MCP-W) Static entities only for code-dependent values; user-maintained lookups as entities with an admin path (`MWD-03`).
3. (MCP-W) CRUD wrappers and idempotent ensure/seed actions; audit columns; soft delete (`MWD-04`).
4. Read back with `getDataModel`; compare with spec §3.

### M5 — Business logic
**Owner**: outsystems-backend-conventions; outsystems-bpt / outsystems-cmf for processes.
1. (MCP-W) Structures and `ActionResult` in `_BL`; user exceptions.
2. (MCP-W) Use-case Service Actions as thin wrappers over private `_Logic` Server Actions: authorize → validate → act → map (`MWL-01`, `MWL-02`); business errors as user exceptions, unexpected ones logged (`MWL-04`).
3. (MCP-W) One action per state transition with history in the same transaction (`MWL-03`).
4. (MCP-W/MCP-W⚠) Timers, processes or outbox for async steps (`MWL-05`).
5. Read back every action; TrueChange clean (`MWG-07`).

### M6 — Integrations
**Owner**: outsystems-backend-conventions (integrations).
1. (MCP-W or MAN) Consume/expose in `_IS`; wrapper actions with timeouts, normalized errors, mock switch (`MWI-01`).
2. (MAN) Per-environment endpoint/credential configuration by the user (`MWI-03`).
3. (MAN/app) One real call per operation with evidence before building on it (`MWI-02`).

### M7 — Screens and UI
**Owner**: outsystems-frontend-conventions + outsystems-live-style-guide.
1. (MCP-W) CW blocks per business part, data actions calling BL, states, `Can*` flags from the server; set `Public = true` (`MWU-01`, `MWU-03`).
2. (MAN) Publish CW, add the dependency in Front_End, Apply; then (MCP-W) screens composing blocks on the existing layout, roles, menu, navigation (`MWU-02`); forms validate on client and server, guard double submit, confirm destructive actions (`MWU-04`).
3. (MCP-W/MCP-W⚠) Theme CSS through the theme stylesheet; verify served CSS (`MWU-05`).
4. (MAN) Translations via export/import (`MWU-06`).

### M8 — Test and validate → G4
**Owner**: outsystems-user-story-implementation (Phases 6–7) + this skill's review.
1. (MCP-R) `getValidationMessages` on every touched module (`MWT-01`).
2. (REV) Publish in dependency order (CS → BL → IS → CW → Front_End) on the user's yes; state merged/published (`MWT-02`).
3. (MAN/browser) One test per AC plus negatives (`MWT-03`); each role's journey back to the entry point (`MWT-04`); data effects (`MWT-05`).
4. BDDFramework tests for BL rules where planned (`MWT-06`), in the test module, pyramid-shaped (`MWT-09`); defects → diagnose first (one falsifiable hypothesis at a time; architecture `OPS-09`) → fix → re-test (`MWT-08`).
5. (MAN) AI Mentor Studio scan of the touched modules; fix Security → Performance → Architecture → Maintainability; record the trend (`MWV-07`).
6. Implementation review (`templates/increment-review.md`) (`MWV-01`).
**Exit = G4**: `node scripts/check-workflow.mjs … --gate G4` passes for the increment (`MWT-07`).

## M9 — Release and handover → G5
1. Regression across increments (`MWV-02`).
2. (MAN) AI Mentor Studio scan; compare with the baseline taken in M0 (`MWV-03`).
3. Performance and security spot checks per architecture `SEC-*` and performance rules.
4. (MAN) Deployment plan for LifeTime: application order, site properties and secrets per environment, roles, translations, data scripts, timers to activate; test apps excluded; no more TrueChange warnings than the previous release; hotfixes only via Development and LifeTime, never edited in place (`MWV-04`).
5. `templates/release-acceptance.md`: AC matrix across increments, open items, manual steps, test data, follow-ups (`MWV-05`).
**Exit = G5**: user approval; `check-workflow.mjs --gate G5` passes (`MWV-06`).

---

## Resuming a half-built app ("continue the build")
1. Read `docs/mentor/workflow-status.md` and run `check-workflow.mjs` (no gate) to see the current phase and errors.
2. If there is no state: run M0 discovery, reconstruct the spec from the model (MCP-R) and the requirements you have, mark everything unverified, and ask the user to approve the reconstructed spec as G2 before more writes.
3. Never trust the state over the model: re-read the elements of the current increment before continuing (`MLL-06`).
