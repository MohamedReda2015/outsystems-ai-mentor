# OutSystems AI Mentor

[![CI](https://github.com/MohamedReda2015/outsystems-ai-mentor/actions/workflows/ci.yml/badge.svg)](https://github.com/MohamedReda2015/outsystems-ai-mentor/actions/workflows/ci.yml)
![version](https://img.shields.io/badge/version-1.3.0-blue)
![platform](https://img.shields.io/badge/OutSystems-11-red)
![license](https://img.shields.io/badge/license-MIT-green)

An **agent-independent skill** that takes an **OutSystems 11** application from business requirements to an accepted release. It works the way **OutSystems Mentor** works on ODC — *requirements → app specification → generate → validate → iterate* — but it is run by an AI agent through the **Service Studio MCP**, under your team's standards.

> Not to be confused with **Code Quality** (formerly AI Mentor Studio), OutSystems' own code-analysis product. This skill *uses* Code Quality at every increment; it does not replace it.

It works with Claude Code, Codex, GitHub Copilot, Cursor, Kiro, Antigravity and custom agents. It is plain Markdown plus one zero-dependency Node.js checker.

## Why
Agents can now read and change O11 modules through the Service Studio MCP. Without a process they tend to:
- generate screens before anyone has agreed on the data model;
- build everything at once;
- try to do through the MCP what only a human can do (dependencies, translations, deployments);
- report "merged" as "done".

This skill gives the agent Mentor's discipline — **review the spec before generating, generate in small steps, validate all the time** — plus what enterprise O11 delivery needs: Canvas architecture, explicit manual steps, gates, traceability and acceptance evidence.

## How it works
```
M0 Setup → M1 Requirements ═G1═ M2 App Spec ═G2═ M3 Architecture ═G3═
   ┌──────────── per increment (thin vertical slice) ────────────┐
   M4 Data → M5 Logic → M6 Integrations → M7 Screens → M8 Test ═G4═
   └──────────────────────── next increment ─────────────────────┘
                                              M9 Release & Handover ═G5═ Done
```

| Gate | Passes when |
|---|---|
| **G1** Requirements ready | no open Blocker/Major question |
| **G2** Spec approved | you approved roles, data model, screens, logic, integrations and increments |
| **G3** Architecture approved | modules on the 3-layer Canvas exist, dependencies are verified |
| **G4** Increment accepted | every acceptance criterion has a result with evidence; review and Code Quality scan done |
| **G5** Release accepted | regression, deployment plan and your sign-off |

Every task gets a **mark**, so it is clear who acts:

| Mark | Meaning |
|---|---|
| **MCP-R** | MCP read (GA for Reactive/Mobile; Beta for Traditional Web) |
| **MCP-W** | Model API write (Beta), reviewed in Compare and Merge |
| **MCP-W⚠** | Beta write with a known gap; verify after publish |
| **MAN** | a human does it: create modules, add dependencies, translations, secrets, Forge, Code Quality, LifeTime deploys |
| **REV** | the agent may do it only after an explicit yes: publish, changes to shared modules |

Details: [the capability matrix](references/mcp-capability-matrix.md).

## Quick start
1. **Install the skill** (see below) and its companion skills.
2. **Set up the O11 MCP**: Service Studio 11.55.91 or later, Edit > MCP Server > Start. Register the server in your agent and install the official skill [OutSystems/outsystems11-mcp](https://github.com/OutSystems/outsystems11-mcp).
3. **Ask your agent**, for example:
   - "Build a leave-request app in O11 from this BRD, Mentor-style."
   - "Where are we? Continue with the next increment."
   - "Review increment 2 against its acceptance criteria."
4. **Check the workflow state** at any gate:
   ```
   node scripts/check-workflow.mjs docs/mentor/workflow-state.json --gate G2
   ```

A complete fictional example is in [examples/leave-requests/walkthrough.md](examples/leave-requests/walkthrough.md).

## Install
| Agent | Skill location | Always-on rules |
|---|---|---|
| Claude Code | `~/.claude/skills/outsystems-ai-mentor/` or the project's `.claude/skills/` | loads from its description |
| Codex CLI | `.agents/skills/` or `~/.codex/skills/` | [adapters/AGENTS.md](adapters/AGENTS.md) → project `AGENTS.md` |
| GitHub Copilot | repository folder | [adapters/copilot-instructions.md](adapters/copilot-instructions.md) → `.github/copilot-instructions.md` |
| Cursor | `.cursor/skills/` or `.agents/skills/` | [adapters/cursor/outsystems-ai-mentor.mdc](adapters/cursor/outsystems-ai-mentor.mdc) → `.cursor/rules/` |
| Kiro, Antigravity, Gemini CLI, custom | the agent's skills folder | `AGENTS.md` block |

```
git clone https://github.com/MohamedReda2015/outsystems-ai-mentor.git ~/.claude/skills/outsystems-ai-mentor
```
Or download the zip from the latest [release](https://github.com/MohamedReda2015/outsystems-ai-mentor/releases) and unpack it into the skills folder.

## Companion skills
The workflow decides **what comes next and who does it**; these skills decide **how**. Each one is optional: missing ones get a short fallback ([skill coordination](references/skill-coordination.md)).

| Skill | Used in |
|---|---|
| [outsystems-brd-analysis](https://github.com/MohamedReda2015/outsystems-brd-analysis) | M1 for a whole BRD |
| [outsystems-user-story-implementation](https://github.com/MohamedReda2015/outsystems-user-story-implementation) | M1 for stories; M8 tests and acceptance |
| [outsystems-architecture](https://github.com/MohamedReda2015/outsystems-architecture) | M3 modules and dependencies; M9 LifeTime |
| [outsystems-backend-conventions](https://github.com/MohamedReda2015/outsystems-backend-conventions) | M4 data, M5 logic, M6 integrations |
| [outsystems-frontend-conventions](https://github.com/MohamedReda2015/outsystems-frontend-conventions) | M7 screens and blocks |
| [outsystems-live-style-guide](https://github.com/MohamedReda2015/outsystems-live-style-guide) | M7 look and feel |
| [outsystems-bpt](https://github.com/MohamedReda2015/outsystems-bpt), [outsystems-cmf](https://github.com/MohamedReda2015/outsystems-cmf) | processes, approvals, cases |
| [OutSystems/outsystems11-mcp](https://github.com/OutSystems/outsystems11-mcp) (official) | MCP tool contract and Model API |

## Repository layout
```
SKILL.md                     entry point: lifecycle, gates, marks, phases
references/                  mentor-approach, workflow-phases, mcp-capability-matrix,
                             app-specification, incremental-delivery, reviews-and-validation,
                             skill-coordination, agent-portability, lessons-learned, review-checklist
templates/                   workflow-status, workflow-state.json, app-specification,
                             architecture-design, increment-plan, increment-review,
                             manual-steps, release-acceptance
scripts/                     check-workflow.mjs, check_skill.mjs, test.mjs, examples/
examples/leave-requests/     worked example
adapters/                    AGENTS.md, Copilot, Cursor
evals/                       behaviour checks for the skill
research/                    sources and the November 2026 assessment
```

## Rules
Rules are defined once in [references/review-checklist.md](references/review-checklist.md). Each has an ID, a severity (Blocker, Major, Minor) and a note on where to find the evidence.

| Prefix | Area |
|---|---|
| `MWS`, `MWR`, `MWP`, `MWA` | setup, requirements, app spec, architecture |
| `MWD`, `MWL`, `MWI`, `MWU`, `MWT` | data, logic, integrations, UI, test |
| `MWV`, `MWG` | review, release, governance and MCP |
| `MLL` | lessons learned |

IDs are stable and are never renumbered.

## Sources
Official OutSystems material comes first, then community practice, then generalized project lessons: see [research/sources.md](research/sources.md). [research/assessment-2026-11.md](research/assessment-2026-11.md) lists what the research changed and the risks that remain.

## Development
```
npm test        # consistency checks + script regression tests (Node 16+)
```
See [CONTRIBUTING.md](CONTRIBUTING.md). Security and privacy: [SECURITY.md](SECURITY.md).

## Disclaimer
This is a community project. It is not affiliated with or endorsed by OutSystems. "OutSystems", "Mentor", "Service Studio", "LifeTime" and "Code Quality" are names of OutSystems products, used here only to describe compatibility. MCP write capabilities are Beta Features under OutSystems' terms. Verify capabilities against your Service Studio version before relying on them.

## License
MIT — see [LICENSE](LICENSE).
