# Changelog

## 1.3.0 — 2026-11-22
Aligned with the November 2026 cross-skill review of the house skills.
- **Code Quality** is the current name of AI Mentor Studio; the skill now uses it throughout (state field `mentorStudio` kept for compatibility).
- The house-wide MCP rules now live in the architecture skill's shared Service Studio MCP reference (`OPS-10`); the capability matrix and skill coordination point to it.
- New rules: `MWA-08` Traditional-to-Reactive moves with Convert to Reactive in producer-to-consumer increments (architecture `MNT-09`); `MWT-10` performance NFRs pass only with measurements (user-story `RQT-13`).
- Capability matrix: Convert to Reactive and Performance Analytics (Beta) rows. Companion rule ranges updated for the new house-skill releases.

## 1.2.0 — 2026-11-22
After reviewing the official OutSystems O11 and ODC MCP skills and a third-party skills collection (maiurnarendra/outsystems-ai-skills, MIT; paraphrased).
- `MWD-01` corrected: static entities are **not** auto-number (ids must match across environments).
- New rules: `MWS-07` ask which platform when both MCP servers are connected; `MWP-09` spec check (screens ↔ roles, entities, relationships, integrations) before G2; `MWV-08` two-axis Standards/Spec code review in the increment review.
- Capability matrix: the official skill now targets MCP contract 2; tool sets by contract and build.
- Skill coordination: optional helper skills (official and third-party) ranked below the house skills; ODC skills never used on O11.
- Defects: diagnose before fixing (architecture `OPS-09`).
- `check-workflow.mjs`: G2 spec check from `roles`, `screens`, `entities` in the state; examples, template and tests updated. Companion rule ranges updated.

## 1.1.0 — 2026-11-22
Research-driven update (official product updates, official O11 MCP design notes and contracts, forum threads and Ideas, testing guidance); details in `research/assessment-2026-11.md`.
- New rules: `MWS-05` live tool set, `MWS-06` environment confirmation, `MWA-07` MCP feasibility for large modules, `MWT-09` test pyramid in a test module kept out of Production, `MWV-07` recurrent AI Mentor Studio scans in priority order, `MWG-08` edit-session discipline, `MWG-09` agent change log, `MWG-10` increment plan sign-off, `MWG-11` flow layout before merge.
- New lessons `MLL-17`…`MLL-21`.
- Capability matrix: read/write status by app type (Traditional Web is Beta even for reads), tool sets by build, edit-session facts, timeouts, governance gaps.
- Mentor approach: what App Generator does and doesn't generate; ODC coding MCP; implementation-plan sign-off; skeleton-first increment ordering.
- Renamed from `outsystems-mentor-workflow` to `outsystems-ai-mentor` (title "OutSystems AI Mentor"); the Cursor adapter is now `adapters/cursor/outsystems-ai-mentor.mdc`. Rule IDs are unchanged.
- Public-release packaging: README rewritten (quick start, install per agent, companion links, rules, disclaimer), worked example `examples/leave-requests/`, issue templates for rule proposals and MCP capability changes, git-ignored private-name screening.
- Checker: errors for unconfirmed environment, missing agent change log after writes, work started without an approved increment plan; warnings for missing tool set and per-increment Mentor Studio scans. Templates and adapters updated.

## 1.0.0 — 2026-11-22
- First release: Mentor-style lifecycle for OutSystems 11 with ten phases (M0–M9) and five gates (G1–G5), incremental vertical slices and an implementation review per increment.
- O11 MCP capability matrix (MCP-R, MCP-W, MCP-W⚠, MAN, REV) based on the official OutSystems 11 MCP skill (contract 1) and behaviour verified by test.
- Rules `MWS`, `MWR`, `MWP`, `MWA`, `MWD`, `MWL`, `MWI`, `MWU`, `MWT`, `MWV`, `MWG`; lessons `MLL-01`…`MLL-16`.
- Templates: workflow status and state, app specification, architecture design, increment plan and review, manual steps, release acceptance.
- `scripts/check-workflow.mjs` gate checker; `scripts/check_skill.mjs` consistency checker; adapters for AGENTS.md, Copilot and Cursor.
