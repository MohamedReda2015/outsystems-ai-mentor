# Assessment of v1.0.0 against research — November 2026

Scope: official OutSystems product updates (O11 MCP, ODC coding MCP, Mentor, AI Mentor Studio), the official OutSystems/outsystems11-mcp repository (contracts and MCP design notes), OutSystems forum threads and Ideas, and community testing guidance. Three community blog articles on ITNext could not be fetched (HTTP 403) and were used only through search-result summaries; treat those points as secondary.

## What v1.0.0 already got right
- Spec before generation, data model first, small reviewed writes, Compare and Merge as the O11 gate, publish only on a yes — all match official positioning and community advice ("give the model a spec and conventions; small requests; publish after each step; ask before publish/deploy/rollback").
- Manual-only steps (dependencies, translations, deploys) and known gaps (stylesheets, CORS, Excel node) match the official known-gaps list.
- Thin vertical increments and continuous validation match how Mentor's App Editor iterates.

## Gaps found and how v1.1.0 closes them
| # | Finding (source) | Risk in v1.0.0 | Change |
|---|---|---|---|
| 1 | Read is GA only for Reactive and Mobile; **Traditional Web read and write are Beta** (official product update) | matrix implied all reads were GA | status-by-app-type table; MCP-R mark updated |
| 2 | Tool sets differ inside contract 1: `listApps` → `listOpenModules`+`searchApps` → `openModule` (official contracts) | agent could call tools that don't exist | `MWS-05`; tool-set table; `platform.toolSet` in state, checker warning |
| 3 | The MCP cannot tell which environment a module came from; the agent inherits the developer's publish rights; LifeTime has no MCP control; changes are credited to the developer (community Idea, staff "evaluating") | "Development only" was a rule with no way to check it; no record of agent changes | `MWS-06`, `MWG-09`; environment confirmation and agent change log in state; checker errors |
| 4 | The agent edits a **copy**; user edits during a session are invisible; partial merges reappear; sessions outlive the chat and are shared by all agents; Service Studio restart wipes the temp folder (official design notes) | silent overwrites and stale reads | `MWG-08`, `MLL-17`; edit-session facts in the matrix |
| 5 | Official timeouts: reads 120 s, writes 300 s; very large modules fail even on name listing; community read-only snapshot workaround (forum) | no feasibility check before planning work in big modules | `MWA-07`, `MLL-20`; options listed in the matrix |
| 6 | Flow layout is a completion gate before `omlMerge` (official skill) | merges of tangled flows | `MWG-11` in the write check |
| 7 | Every connection shows an approval prompt; the client name in it is self-reported (official design notes, community review) | approving unknown agents | governance note; core rules |
| 8 | Mentor shows an implementation plan for complex changes and asks for sign-off (product page) | increment plans could be built without approval | `MWG-10`; `planApproved` in state; checker error |
| 9 | Mentor App Generator: strong on data/roles/CRUD/status flow; at launch no Workflows, no ad-hoc REST/Service Actions, weak complex logic; document tables and images ignored (staff announcement) | increment ordering ignored where generation is weak | `MLL-19`; "skeleton early, hard parts next" ordering; mentor-approach facts |
| 10 | ODC coding MCP is GA on every ODC tenant; model changes go through Mentor; it covers publish, promote, rollback, logs (product update) | ODC note was vague | mentor-approach §5 rewritten |
| 11 | AI Mentor Studio: recurrent analysis recommended; priority Security → Performance → Architecture → Maintainability; deprecated-element detection for O11; "% high tech debt" has no official benchmark (product update, forum, practitioners) | scan only at release | `MWV-07`, `MLL-21`; per-increment scan field; checker warning |
| 12 | BDDFramework: server-side logic focus, Gherkin, not for production; test pyramid with core-layer tests in a dedicated module (Forge docs, community standards) | test code could ship to Production; UI-heavy tests | `MWT-09`; test module in M3; deployment plan excludes test apps |
| 13 | Deployment practice: no promotion with more TrueChange warnings than before; hotfixes only via Development and LifeTime (community standards) | not in the release checklist | M9 deployment plan updated |

## Not adopted (and why)
- **Auto-merge-and-publish** (opt-in Beta setting): conflicts with `MWG-04`; allowed only in a personal sandbox by explicit choice, as the companion user-story skill already states.
- **Running the unofficial oml snapshot tool for writes**: the workaround is read-only by its author's own statement; writing would bypass Compare and Merge.
- **LifeTime MCP for O11** (community component on Forge): not official; deployments stay MAN.

## Residual risks
- MCP contract 2 will change tool names and capabilities: re-check the matrix when the server reports a new contract.
- Mentor feature claims come largely from vendor material; facts were limited to what staff stated.
- Governance gaps (environment, attribution) remain until OutSystems ships controls; the rules here are procedural mitigations, not enforcement.
