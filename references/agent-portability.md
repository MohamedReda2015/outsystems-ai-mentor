# Running the workflow in any agent

The skill is plain Markdown plus one Node.js script (Node 16+, no packages). Nothing depends on one vendor's features.

## 1. Installing the skill
| Agent | Where the skill goes | Always-on rules |
|---|---|---|
| Claude Code | `~/.claude/skills/outsystems-ai-mentor/` (or the project's `.claude/skills/`) | the skill loads on demand from its description |
| Codex CLI | `.agents/skills/` or `~/.codex/skills/` | copy `adapters/AGENTS.md` into the project's `AGENTS.md` |
| GitHub Copilot (VS Code / CLI) | repository folder | `adapters/copilot-instructions.md` → `.github/copilot-instructions.md` |
| Cursor | `.cursor/skills/` or `.agents/skills/` | `adapters/cursor/outsystems-ai-mentor.mdc` → `.cursor/rules/` |
| Kiro, Antigravity, Gemini CLI, custom agents | the agent's skills folder | `AGENTS.md` block |

Install the companion skills the same way; the workflow names them and falls back when one is missing (`references/skill-coordination.md` §4).

## 2. Connecting the O11 MCP server
The Service Studio MCP server runs locally (default `http://127.0.0.1:41820/mcp`), started per session from **Edit > MCP Server** with a module open. Register it in the agent's MCP configuration (the official OutSystems/outsystems11-mcp repository has a sample for each agent) and install the official **servicestudio-mcp-oml** skill. The first call shows an approval prompt in Service Studio.

## 3. Agent differences that matter
- **Long calls**: large modules can take minutes per call. Agents with short tool timeouts should call the MCP endpoint from a small script with a long timeout, and keep long lambdas in files.
- **Parallel tools**: never run two calls on one module at the same time, even if the agent supports parallel tool calls.
- **Context size**: keep big read results out of the conversation (write them to files and summarize); keep the workflow state in files, not in chat (`MWG-05`).
- **Sub-agents**: read-only discovery (M0) and reviews can go to sub-agents; writes to one module stay in one agent at a time.
- **Two MCP servers registered** (O11 and ODC): name the platform in every request so the call reaches the right server.

## 4. Portable conventions
- Paths are relative to the project; the state folder defaults to `docs/mentor/`.
- Templates are Markdown and JSON; no tool-specific syntax.
- The checker prints plain text or JSON (`--json`) and exits 1 on errors, so any agent or CI can use it.
- Rule IDs are the shared language between agents and people: cite them in plans, reviews and commit messages.
