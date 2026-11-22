# Contributing

Thanks for helping improve **outsystems-ai-mentor**. This repository is an agent skill: Markdown that AI agents (and people) read to deliver OutSystems 11 applications end to end, Mentor-style, through the Service Studio MCP. Every change must stay **accurate, sourced, agent-independent and concise**.

## Ways to contribute
- **Update the MCP capability matrix** when a Service Studio release or MCP contract adds, fixes or changes a capability (`references/mcp-capability-matrix.md`). Say which version and how you verified it.
- **Propose a rule**: open a "Rule proposal" issue with the problem, the rule, the severity and a source.
- **Report a wrong or outdated rule**: open a "Bug / inaccuracy" issue and link the source that contradicts it.
- **Add a lesson learned**: a real delivery mistake, written as *what happened → rule*, with no client or personal details.
- **Improve tooling**: the workflow checker (`scripts/check-workflow.mjs`), the consistency checker or the CI workflows.

## Content rules
1. **Cite sources** in `research/sources.md`: official OutSystems material first, then community practice, then generalized project lessons. Mark capability claims as *official* or *verified by test (version, date)*.
2. **Paraphrase, don't copy.** Short quotes only.
3. **No confidential data.** No client names, module names from client projects, hostnames, credentials, personal data or screenshots of private systems. Use fictional examples (`Leave_CS`, "Product Owner").
4. **Explain the reason** behind each rule in one sentence.
5. **Agent-independent.** Plain Markdown and zero-dependency Node.js. Tool-specific wording belongs only in `adapters/`.
6. **Stay in scope.** This skill owns the lifecycle (order, gates, increments, MCP vs manual). Requirements analysis, architecture, code conventions, UI and processes belong to the companion skills: cite their rule IDs.
7. **Keep SKILL.md small** (under ~300 lines).

## Rule IDs
- Rules live in `references/review-checklist.md` as `| ID | Severity | Rule | Check |`; lessons in `references/lessons-learned.md` as `**MLL-nn …**`.
- **IDs are stable**: never renumber or reuse. New rules take the next free number in their group (`MWS`, `MWR`, `MWP`, `MWA`, `MWD`, `MWL`, `MWI`, `MWU`, `MWT`, `MWV`, `MWG`). Retired rules stay, marked *Deprecated*.
- Cited companion-skill IDs are validated against the ranges in `scripts/check_skill.mjs`; update them when a companion adds IDs.

## Before you open a pull request
```
npm test     # node scripts/check_skill.mjs && node scripts/test.mjs
```
- Update `CHANGELOG.md`; bump `metadata.version` in `SKILL.md` and `version` in `package.json` together for releases.
- If you changed `adapters/core-rules.md`, copy the same block into `adapters/AGENTS.md`, `adapters/copilot-instructions.md` and `adapters/cursor/outsystems-ai-mentor.mdc`. The checker fails if they differ.

## Releases (maintainers)
1. Bump versions and add `## <version> — <date>` to `CHANGELOG.md`.
2. Merge to `main`, tag `v<version>`, push the tag. The release workflow re-runs the checks and attaches the packaged zip.

## Code of conduct
By participating you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
