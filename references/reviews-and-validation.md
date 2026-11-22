# Reviews and validation

Mentor validates continuously; this workflow does the same at three levels:

| Level | When | Tool | Rule |
|---|---|---|---|
| **Write check** | after every `applyModelApiCode` | exception message, `getValidationMessages`, read-back | `MWG-07` |
| **Increment review** | end of every increment, before G4 | `templates/increment-review.md` + companion checklists | `MWV-01` |
| **Release review** | before G5 | regression, Code Quality (formerly AI Mentor Studio), deployment plan, release acceptance | `MWV-02`…`MWV-06` |

## 1. Write check (each MCP write)
1. `exceptionMessage` empty.
2. `getValidationMessages` (filter `error`, then `warning`): no new item from this change.
3. Read the element back (`getServerAction`, `getScreen`, `getDataModel`…) and compare with the plan: names, types, public flags, roles, folders.
4. Lay out every flow you created or changed before merging (`MWG-11`).
5. Log the change (module, element, merge time) in the agent change log (`MWG-09`).
6. Fix before the next write; never stack changes on a broken model.

## 2. Increment review (the "implementation review")
Run it as a structured self-review, then show it to the user. Sections of `templates/increment-review.md`:

**A. Requirements coverage** — validation against business requirements
- Every AC of the increment → tasks → OutSystems elements → test → result. No AC without a test; no element without an AC (scope creep) unless it is enabling infrastructure.
- Each business rule ID → the action that enforces it on the server → the test that breaks it.
- Each status transition → action → history row seen in the data.
- Each role → screens and actions it can and can't reach, tested.

**B. Acceptance criteria results** — Pass (evidence), Fail (defect ID), Blocked (reason, owner), Not tested (reason, owner). Evidence = what was observed in the published app or data, not "implemented".

**C. Code review on two axes** (`MWV-08`, user-story `RQT-12`) — keep them independent:
- *Standards*: the changed elements against the companion checklists only, without reading the stories.
- *Spec*: each AC of the increment as Met (cite element › node) / Partly met / Not found / Needs testing; report out-of-scope changes and risks the spec implies.
- Mark findings unrelated to this increment **(pre-existing?)** and propose a separate debt item. Verdict: Blocked (Blocker finding, TrueChange error or AC Not found) / Needs changes (Major finding or Partly met) / Ready.

**C2. Standards** — run each companion's review checklist on what this increment touched:
| Area | Checklist |
|---|---|
| Layers, dependencies, security | outsystems-architecture `references/review-checklist.md` |
| Server code, data, integrations | outsystems-backend-conventions checklist |
| Screens, blocks, client logic | outsystems-frontend-conventions checklist |
| UI, accessibility, RTL | outsystems-live-style-guide checklist |
| Processes, cases | outsystems-bpt / outsystems-cmf checklists |
Report findings as `ID — evidence — fix`.

**D. MCP hygiene**
- All merges reviewed in Compare and Merge; no unmerged edit session left open.
- Published state per module (merged / published / version) is known.
- Known-gap items (MCP-W⚠) verified after publish (served CSS fetched, process reviewed in Service Studio).
- Flows laid out before merge; agent change log complete (`MWG-09`, `MWG-11`).
- No stale edit session: after human edits or partial merges the session was restarted (`MWG-08`).
- No secrets typed; no default values with real data.

**E. Manual steps** — done, pending (owner), or blocked.

**F. Lessons** — what slowed the increment; what to change for the next one; new lessons for `references/lessons-learned.md`.

**Verdict** — G4 passes only when A–E have no open Blocker and the user agrees.

## 3. Validation against requirements: techniques
- **Trace matrix**: feature → story → AC → element → test, kept in `workflow-state.json`; `scripts/check-workflow.mjs` finds gaps.
- **Example walk**: take each Example Mapping example from clarification and run it in the app.
- **Negative set**: no role, another user's record, wrong state, invalid input, double submit, integration failure, deep link, Back (`MWT-03`).
- **Test pyramid** (`MWT-09`): most automated tests on BL actions/APIs (BDDFramework in a test module), fewer on UI journeys; UI journeys cover each role once end to end.
- **Data check**: query the outcome (aggregate on a test screen or Service Center) — status, history, audit, notifications (`MWT-05`).
- **Language pass**: every label, message and status in every language; RTL layout (`MWU-06`).

## 4. Code-quality validation
- **TrueChange** (MCP-R): zero errors, no new warnings.
- **Code Quality** (MAN): take a baseline in M0 for brown-field apps; scan **every increment** once code is in Development, not only before release — practitioners stress recurrent analysis so problems are caught while cheap (`MWV-07`); fix in the order Security → Performance → Architecture → Maintainability; include deprecated-element findings (O11 now flags modules that consume elements no longer recommended); at G5 new findings must be fixed or accepted with a reason (`MWV-03`). The "% high tech debt" figure has no official target: track its trend and the findings behind it, not an absolute number. Its patterns are listed in the architecture skill's code-quality reference.
- **MCP risk scan** (MCP-R): "flag security, performance and dead-code concerns in this module" — a cheap pre-check before the human scan; confirm each item by reading the element.

## 5. Evidence rules
- Say what you saw, where, as which user, on which published version.
- Screenshots are evidence of UI only; data effects need a data read.
- CSS/styling is proven by the served CSS file, not by a screenshot alone.
- Never mark Pass for something you did not run (`MWT-07`).
