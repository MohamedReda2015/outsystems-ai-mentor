# Coordinating the companion skills

This skill is the **conductor**: it decides the order, the gates and who acts. The companion skills are the **players**: each owns the "how" of its area and its own rule IDs. Cite their rules; never copy or redefine them (`MWG-01`).

## 1. Ownership by phase
| Phase | Lead skill | Also used | Hand-off artifact |
|---|---|---|---|
| M0 Setup | this skill | architecture (its Service Studio MCP reference), official servicestudio-mcp-oml | workflow-status, context |
| M1 Requirements | brd-analysis **or** user-story-implementation | — | requirements baseline, clarification log, glossary |
| M2 App Spec | this skill | brd-analysis (stories, phased plan), bpt (`PDS-01` mechanism choice), style guide (patterns) | app-specification |
| M3 Architecture | architecture | backend (naming), cmf/bpt (placement) | architecture-design, manual steps |
| M4 Data | backend-conventions | architecture (`DAT-*`) | model + read-back |
| M5 Logic | backend-conventions | bpt, cmf, architecture (`SEC-*`) | model + read-back |
| M6 Integrations | backend-conventions | architecture (integration patterns) | model + call evidence |
| M7 UI | frontend-conventions | live-style-guide | model + served CSS |
| M8 Test | user-story-implementation (Phases 6–7) | architecture (`TST-*`) | test results, increment review |
| M9 Release | architecture (LifeTime SOPs) | user-story-implementation (acceptance report) | release acceptance, deployment plan |

All MCP calls follow the official **servicestudio-mcp-oml** skill (tool contract, lambda format, known gaps); this skill only decides *whether* and *when* to call.

## 2. Hand-off contracts
- **From brd-analysis / user-story to M2**: feature list with story and AC IDs, rules with IDs, statuses and transitions, roles, integrations, NFRs, glossary, answered questions. The spec imports IDs unchanged.
- **From M2 to the user-story skill**: when an increment is built story by story, each story enters the user-story skill at Phase 4 (Plan) with the spec as context; its Gate A is already satisfied by G1 for that story unless new questions appear.
- **From M3 to M4–M7**: module names, dependency list, folder conventions, the manual-steps list.
- **From M8 back to this skill**: AC results with evidence, defects, review findings, manual steps done/pending.

## 3. Conflicts between skills
1. Project conventions (AGENTS.md, blueprint) beat the house skills — say so.
2. Architecture beats convention skills on placement and dependencies.
3. Security rules (`SEC-*`, `FSC-*`, `BSC-*`) are never relaxed by any precedence; flag and ask.
4. If two companions disagree on something else, follow the more specific one and record the decision in `workflow-state.json` → `decisions`.

## 4. When a companion skill is missing
Use these minimum fallbacks and say which skill is missing:
- **No brd-analysis / user-story**: extract features, rules, statuses, roles, ACs (Given/When/Then) yourself; ask Blocker/Major questions in one batch; never invent data.
- **No architecture**: Front_End → CW → BL → CS (+ `_IS`, `_Th`); no upward or side references; entities public read-only, written only through actions; roles on every screen; server checks behind every client check.
- **No backend**: thin Service Actions over private logic; authorize → validate → act; one transaction per use case; integrations wrapped with timeouts.
- **No frontend / style guide**: blocks per business part; aggregates fetch only what's shown; loading/empty/error states; OutSystems UI patterns and theme classes; no inline styles.
- **No official servicestudio-mcp-oml**: do not write through the MCP. Use MCP-R reads only and deliver changes as exact manual steps; ask the user to install the official skill.

## 5. Rule-ID map (for citations)
`BRI/BRX/BRQ/BRC/BRS/BRM/BRT/BRR` brd-analysis · `RQA/RQV/RQC/RQP/RQI/RQT/RQD` user-story · `ARC/HSE/DAT/INT/UI/SEC/AUD/MNT/OPS/TST/PERF` architecture · `BNM/BLG/BTX/BDA/BIN/BER/BAS/BPF/BSC/BCF` backend · `NAM/STR/BLK/NAV/LCY/FET/STA/CLG/VAL/ERR/JSC/FSC/FPF/MOB/LOC/VER` frontend · `TOK/THM/LAY/RSP/CMP/FRM/LST/FDB/TXT/PRF/GOV` style guide · `PAR/PDS/PHA/PAA/PLT/PEX/PVR/POP/PSC/PNM` bpt · `CAR/CDF/CST/CAC/CSC/CSL/CUI/COP` cmf · `MWS/MWR/MWP/MWA/MWD/MWL/MWI/MWU/MWT/MWV/MWG`, lessons `MLL` — this skill.
