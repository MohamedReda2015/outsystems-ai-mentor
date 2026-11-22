# Worked example: a leave-request app, Mentor-style, on O11

A fictional, anonymized walk through every phase. The machine-readable state at the end of increment 2 is [`scripts/examples/good-state.json`](../../scripts/examples/good-state.json); check it with:
```
node scripts/check-workflow.mjs scripts/examples/good-state.json
node scripts/check-workflow.mjs scripts/examples/good-state.json --gate G4 --increment 2
```

## M0 — Setup
- **User**: "Build a leave-request app in our O11 dev environment from this BRD."
- **Agent**: confirms O11, asks which environment the open modules come from (the MCP can't tell) and records "Development, confirmed by Tech Lead" (`MWS-06`); checks the live tool set — `listOpenModules`, `searchApps`, `openModule` (`MWS-05`); creates `docs/mentor/` with the status file, state file and an empty agent change log (`MWG-09`). Green-field, so no AI Mentor Studio baseline.

## M1 — Requirements → G1
- The BRD goes to **outsystems-brd-analysis**. It finds 2 features, 4 acceptance criteria and 3 open questions.
- One batched question list:
  - **Q-01 (Blocker)**: Can a manager approve their own request? *Recommendation: no.* → Answered: no.
  - **Q-02 (Major)**: Is the leave-type list maintained by HR? *Recommendation: yes, lookup entity.* → Answered: yes.
  - **Q-03 (Minor)**: Page size → assumed 20 rows, shown to the user.
- **G1 passes**: no open Blocker or Major question.

## M2 — App Specification → G2
One-page summary shown first (`templates/app-specification.md`):
- **Roles**: Employee (own requests), Manager (team queue), HR Admin (leave types).
- **Entities**: LeaveRequest, LeaveRequestHistory, LeaveType (lookup, HR-maintained), LeaveStatus (static: code branches on it).
- **State machine**: Draft → Submitted → Approved / Rejected; Submitted → Cancelled (the spec review added *Cancelled*, which the BRD had missed).
- **Increments**:
  1. Submit and see My Requests (skeleton).
  2. Approve or reject from a queue (state machine, notifications).
  3. HR leave-type admin.
- **G2 passes**: approved by the Product Owner as spec v1.1.

## M3 — Architecture → G3
- **outsystems-architecture** places `Leave_CS`, `Leave_BL`, `Leave_CW`, `Leave_Front_End`, `Leave_Th`, plus `Leave_Tests` (BDDFramework, excluded from Production) (`MWT-09`).
- **Manual steps** for the user:
  - **MS-01**: create the app and modules.
  - **MS-02**: Leave_BL depends on Leave_CS — tick, **Apply**, publish.
- The user says "done". The agent restarts its edit session and probes `eSpace.References`; MS-02 is now verified (`MWA-05`).
- All modules are small, so no MCP timeout plan is needed (`MWA-07`).
- **G3 passes.**

## Increment 1 — Submit a request → G4
- **Plan approved** before any write (`MWG-10`):
  - T01: LeaveRequest entity — MCP-W
  - T02: dependency — MAN
  - T03: SubmitLeaveRequest — MCP-W
  - T04: form block — MCP-W
  - T05: publish — REV
- **Writes**:
  - Each write: exception empty, TrueChange clean, read-back, flows laid out, merged, logged (`MWG-07`, `MWG-11`, `MWG-09`).
  - The Service Action needed Start/End nodes added (`MLL-10`).
  - The new block was set public before Front_End used it (`MLL-11`).
- **Publish** in order CS → BL → CW → FE after the user's yes.
- **Tests** on the published version:
  - AC-01 Pass: status Submitted and a history row seen.
  - AC-02 Pass: end date before start date shows the rule message and nothing is written.
- **Review and scan**: AI Mentor Studio scan with no new findings; implementation review done (`MWV-07`, `MWV-01`).
- **G4 passes.**

## Increment 2 — Approve or reject (in progress)
- **Plan approved.**
- **Manual step MS-03**: the user imports Arabic translations, since the MCP can't write translations.
- **Edit session**: while the agent's session on `Leave_BL` was open, the user wanted to fix a label in that module. The agent asked them to wait, merged, ended the session, let them edit, then started a new session (`MWG-08`).
- **Results**:
  - AC-03 Pass.
  - AC-04 Blocked: HR hasn't supplied the rejection-reason list. Owner: HR.
- **G4 can pass** with AC-04 recorded as Blocked with an owner, once the user agrees.

## Still to do before release (G5)
Increment 3, the regression run across increments, an AI Mentor Studio comparison, the LifeTime deployment plan (test app excluded, site properties and roles per environment), and the release acceptance. The checker shows exactly these as G5 blockers:
```
node scripts/check-workflow.mjs scripts/examples/good-state.json --gate G5
```
