# Sources

Where the rules come from. *Official* = OutSystems documentation or repositories; *community* = forums, blogs, talks; *project* = generalized lessons from real O11 projects (no client details).

## Official
- OutSystems 11 MCP repository (OutSystems/outsystems11-mcp): README "Capability status" (read GA, write Beta, Compare and Merge, Beta Features Agreement), setup per agent, MCP contract numbers; `servicestudio-mcp-oml` skill: tool catalogue, edit session, full-lambda contract, module-style support, **Known gaps** (dependencies, translations, stylesheets, CORS, Excel node, no undo), security caveat. Basis of `references/mcp-capability-matrix.md`.
- OutSystems MCP for ODC (OutSystems/outsystems-mcp): hosted MCP, confirm-before-destructive rule. Used only to state that the O11 matrix does not apply to ODC.
- OutSystems Mentor (ODC) product documentation and release notes: generation from prompts and requirements documents, app specification review before generation, continuous validation, iteration; document images and tables ignored at release. Basis of `references/mentor-approach.md`.
- AI Mentor Studio (O11) documentation: code-quality categories (architecture, performance, security, maintainability), module classification. Used in M8/M9.
- Architecture Canvas and application architecture guidance; Platform best practices; LifeTime deployment. Owned by outsystems-architecture; cited here.

### Added in the November 2026 research (v1.1.0)
- OutSystems 11 MCP product update — read GA for Reactive/Mobile; write and Traditional Web in Beta; Compare-and-Merge by default; runs on the developer's machine. https://outsystems.com/product-updates/outsystems-11-mcp
- OutSystems coding MCP (ODC) product update — GA on every ODC tenant; Mentor builds; publish/promote/rollback/logs under ODC roles and audit. https://www.outsystems.com/product-updates/outsystems-coding-mcp
- Mentor streamlined development product update — App Generator extracts data models and authorization from documents; map views; "see all, edit own"; themes; App Editor authorization suggestions. https://www.outsystems.com/product-updates/mentor-streamlined-development
- Mentor App Generator and App Editor announcement (staff, forum) — what is and isn't generated; documents' images/tables ignored; data-driven apps. https://www.outsystems.com/forums/discussion/101351/introducing-mentor-app-generator-app-editor/
- Mentor product page — editable blueprints before generation; implementation plan sign-off for complex changes. https://www.outsystems.com/platform/mentor-ai-app-generation
- Deprecated code detection in AI Mentor Studio (O11). https://www.outsystems.com/product-updates/o11-deprecated-code-detection-in-ai-mentor-studio
- OutSystems/outsystems11-mcp `reference/contracts.md` (tool sets per build) and `reference/mcp-design-choices.md` (edit-session copy, shared sessions, temp-folder wipe, per-connection approval, timeouts 120 s / 300 s, server started on demand).

## Community (added in v1.1.0)
- Idea "Let us control where the Service Studio MCP server may be used per environment" — no LifeTime control, agent inherits developer rights, no environment reported, changes credited to the developer; staff evaluating. https://www.outsystems.com/Ideas/15580/let-us-control-where-the-service-studio-mcp-server-may-be-used-per-environment/
- Forum: reading large O11 modules when MCP calls time out — 120 s read timeout on name listing; read-only snapshot workaround. https://outsystems.com/forums/discussion/107174/workaround-reading-large-outsystems-11-modules-with-claude-code-when-mcp-calls-t
- Forum: "Why not just allow models to replace AI Mentor" — O11 model edits a copy, Compare and Merge as gate; spec + conventions as context; small steps; ask before publish/deploy/rollback. https://outsystems.com/forums/discussion/107118/why-not-just-allow-models-to-replace-ai-mentor
- Forum: AI integration with Kiro or Claude Code — early-access status at the time; some data-model reads empty. https://outsystems.com/forums/discussion/106629/ai-integration-for-outsystems-development-kiro-or-claude-code
- Forum: AI Mentor Studio "% high tech debt" — no official benchmark; prioritize Security → Performance → Architecture → Maintainability. https://www.outsystems.com/forums/discussion/105800/question-about-ai-mentor-studio-high-technical-debt
- ITNext: containing and reducing technical debt in O11 — recurrent AI Mentor Studio analysis (search summary only; page blocked automated fetch). https://itnext.io/suggestions-for-containing-and-reducing-technical-debt-in-outsystems-11-a62caf104678
- ITNext hands-on with the O11 and ODC MCPs — gate placement, opt-in auto-merge, self-reported client name (search summary only; page blocked automated fetch). https://itnext.io/outsystems-agent-experience-first-hands-on-with-o11-and-odc-mcps-9962f4c22c37
- BDDFramework (Forge) and OutSystems BDD guide — Gherkin, server-side logic, not for production. https://www.outsystems.com/forge/component-overview/1201/bddframework · https://www.outsystems.com/blog/posts/intro-bddframework-testing/
- Community standards (Synobsys): BDDFramework for component testing; code review checklist; no promotion with more TrueChange warnings. https://synobsys.github.io/adr/ADR-004-bdd-framework-for-component-testing.html
- Forum: best way to test Reactive apps in O11 (BDD, E2E, unit, API). https://www.outsystems.com/forums/discussion/101411/best-way-to-test-your-reactive-apps-bdd-e2e-unit-api-testing-in-o11

## Companion skills (house standards)
outsystems-brd-analysis v1.2.0, outsystems-user-story-implementation v1.1.1, outsystems-architecture v2.0.0, outsystems-backend-conventions v1.2.0, outsystems-frontend-conventions v1.1.0, outsystems-live-style-guide v2.0.0, outsystems-bpt v1.2.0, outsystems-cmf v1.1.1.

## Community
- Discussions on agentic development with the O11 MCP: naming the platform when O11 and ODC servers are both registered; LifeTime has no MCP-specific permission yet; Mentor-generated apps as drafts needing review.
- Incremental delivery practice: vertical slicing, walking skeleton first, risk-first ordering.

## Project (verified by test, late 2026, Service Studio 11.55.91, contract 1)
- Dependencies invisible until the edit session restarts; users reporting "done" before Apply (`MLL-02`).
- Non-empty block stylesheet merges not deployed; served-CSS check (`MLL-05`).
- Large modules timing out; sidecar killed at short timeouts (`MLL-09`).
- Service Actions without Start/End nodes; new blocks not public (`MLL-10`, `MLL-11`).
- Secret site-property defaults readable by the agent (`MLL-13`).
