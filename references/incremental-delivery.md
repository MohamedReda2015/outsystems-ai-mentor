# Incremental delivery: slices, order, change and resumption

Mentor's strength is the short loop: generate a little, look at it, adjust. On O11 with the MCP the loop is even more important, because writes are Beta, every merge is reviewed, and some steps wait for a human. Big-bang builds fail (`MLL-04`).

## 1. What an increment is (`MWP-08`)
A **vertical slice**: the smallest set of features that a real user can use and that can be tested end to end — data + logic + (integration) + screen. Not "all entities", not "all screens".

Good: "Requester can create and submit a request; reviewer sees it in a queue."
Bad: "Create all CS entities." / "Build all list screens."

## 2. Ordering increments
1. **Increment 0 — Foundation** (often merged into increment 1): modules created (MAN), dependencies, theme/layout, roles, core lookups, the main entity and its CRUD, an empty landing screen with menu. Proves the whole chain publishes.
2. **Skeleton early, hard parts next**: Mentor-style generation is strongest at the data-driven skeleton (data, roles, CRUD screens, status flow) and weakest at processes, integrations and complex rules — so put the skeleton in increment 1 and the hard parts right after it (`MLL-19`).
3. **Riskiest first**: integrations with unknown behaviour, the state machine, the most complex rule — early, while change is cheap.
4. **Happy path before variations**: the basic flow, then alternative and exception flows, then admin screens, dashboards and reports.
5. **Respect dependencies**: a slice that reads data another slice creates comes after it, or seeds fictional data.
6. **Keep MAN steps batched**: group dependency additions and translations per increment so the human is asked once (`MWA-04`).

## 3. Inside one increment
```
plan (increment-plan) → M4 data → M5 logic → M6 integration → M7 UI → publish (REV) → M8 test → review → G4
```
- Increment plan approved before the first write (`MWG-10`).
- One MCP edit session per module per concern; merge often; read back every time (`MWG-07`); restart the session after any human edit or partial merge (`MWG-08`).
- Publish in dependency order: `_CS` → `_BL` → `_IS` → `_CW` → `_Front_End`; refresh references on each consumer.
- Keep the increment's tasks and AC results in `workflow-state.json` as you go.

## 4. Sizing
Aim for an increment the agent and the user can finish, test and review in one to three working sessions. If the plan has more than ~25 tasks or more than ~8 ACs, split it.

## 5. Change requests after G2
1. Write the change: what, why, which features/ACs it touches.
2. Impact (MCP-R): which entities, actions, screens and tests are affected; which increments already passed G4.
3. Update the spec (new version), get approval for the change, then plan it as part of the next increment or a new one.
4. Increments already at G4 that the change touches get their ACs re-run (regression).
Never change an approved spec silently during build (`MLL-07`).

## 6. Rework and rollback
- Unmerged chain wrong: `omlReset` drops it (no partial undo).
- Merged but not published: fix forward in a new edit session.
- Published and wrong: fix forward; for a bad release in later environments, rollback is a LifeTime action by a human (MAN).
- Record every rework cause in the increment review's lessons.

## 7. Resuming
`workflow-state.json` tells which phase and increment are open, which tasks are done, which MAN steps wait for whom. Re-read the model for the open increment before continuing; the state can be stale (`MLL-06`).
