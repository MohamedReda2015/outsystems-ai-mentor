# Changelog

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
