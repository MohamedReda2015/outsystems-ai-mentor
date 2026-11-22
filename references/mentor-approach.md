# The OutSystems Mentor approach, adapted to O11

## 1. What Mentor is (official, ODC)
OutSystems Mentor is the generative-AI layer of OutSystems Developer Cloud (ODC). Its published working model, in short:

1. **Start from intent**: a prompt or a requirements document (PDF/DOCX).
2. **Understand and specify**: Mentor extracts the requirements and proposes an **app specification** — the app's purpose, users/roles, features (often as user stories), the **data model** (entities, attributes, relationships, sample data), screens and logic. Mentor asks clarifying questions in conversation.
3. **Human review before generation**: the developer edits and approves the specification.
4. **Generate**: Mentor generates a working app (data, screens, logic) following platform best practices.
5. **Validate continuously**: Mentor checks code quality, security, performance and architecture, and suggests fixes (the same family of patterns as **AI Mentor Studio** in O11).
6. **Iterate**: the team asks for changes in small steps ("add an approval step", "add a dashboard") and reviews each.
7. **Govern**: everything still goes through the platform lifecycle (review, publish, deploy).

### What Mentor's App Generator actually produces (staff announcement and product updates)
- **Generated**: entities, attributes, static entities and records, roles, authorization (client and server checks, including "see all, edit own"), list (table/gallery, map view for location data), detail and edit screens, tabs for related records, status transitions, menu with icons, dashboard, theme (also detected from documents), sample data and sample users per role (development only).
- **Reviewed before generation**: the "blueprint" — entities and roles can be edited before generating. **After generation**, the App Editor suggests structure and data-model improvements, and for complex changes shows an implementation plan to approve before applying.
- **Not generated or weak** (staff-confirmed at launch; re-check current releases): ODC Workflows (build by hand), ad-hoc REST endpoints and Service Actions, complex business logic; apps are "very data-driven" and screens pattern-driven. Images and tables in uploaded documents were ignored. Mentor App Generator is ODC-only.

Lessons for this skill: Mentor is strongest at the **data-driven skeleton** (data, roles, CRUD screens, status flow) and weakest at **processes, integrations and complex rules** — so this workflow puts the skeleton in the first increment and plans processes, integrations and rules as explicit, risk-first increments with their companion skills (`MLL-19`).

## 2. What exists on O11
| Mentor capability | O11 equivalent | Mark |
|---|---|---|
| Read requirements, ask questions, propose a spec | The agent + outsystems-brd-analysis / outsystems-user-story-implementation + `templates/app-specification.md` | agent |
| Read the existing app | Service Studio MCP read tools (GA) | MCP-R |
| Generate data, logic, screens | Service Studio MCP `applyModelApiCode` (Beta) + the official servicestudio-mcp-oml skill + house conventions | MCP-W |
| Human review of generated changes | Compare and Merge | REV |
| Continuous validation | TrueChange (`getValidationMessages`), companion review checklists, AI Mentor Studio (separate product, manual scan) | MCP-R + MAN |
| Iterate in small prompts | Increments and change requests in this workflow | agent |
| Lifecycle governance | Publish (on a yes), LifeTime deploy (manual) | REV + MAN |

There is no O11 button that "generates an app from a document". This skill makes the agent do the same work, **explicitly and in steps**, so every generated element is reviewed against the spec and the house standards.

## 3. What this skill keeps from Mentor, and what it changes
**Kept**
- **Spec before code**: nothing is generated until the App Specification is approved (G2).
- **Data model first**: the data model drives screens and logic, as in Mentor's generation order.
- **Generate small, review every time**: each MCP write is small and reviewed; each increment is reviewed.
- **Validation is continuous**, not a final phase: TrueChange after every write, review at every increment.
- **Conversation for clarification**, but answers are written down (clarification log), not left in chat.
- **Implementation plan sign-off** before a change is applied: every increment plan is approved before its first write (`MWG-10`).
- **Gaps flagged in the requirements** (Mentor's demos show it pointing out a missing cancellation stage): the spec review checks the state machine for missing entries and exits.

**Changed for enterprise O11 delivery**
- **Architecture is explicit** (Mentor generates one app; O11 enterprise apps use the 3-layer Canvas and the house chain Front_End → CW → BL → CS with separate modules and apps).
- **Security is designed, not assumed**: roles on every screen, server-side checks, no secrets in defaults.
- **Workflows** (approvals, SLAs, cases) are designed with outsystems-bpt / outsystems-cmf, not generated blindly.
- **Manual steps are first-class**: the MCP cannot create modules, add dependencies, write translations or deploy; the workflow plans those steps with owners instead of hoping.
- **Traceability**: every element traces to a feature, story and acceptance criterion; acceptance is proven in the running app.

## 4. Mentor stages → phases of this skill
| Mentor stage | Phase | Gate |
|---|---|---|
| Start from intent | M0 Setup, M1 Requirements | G1 |
| Understand and specify | M2 App Specification | G2 (Mentor's review) |
| (no Mentor equivalent: enterprise structure) | M3 Architecture | G3 |
| Generate | M4 Data → M5 Logic → M6 Integrations → M7 Screens, per increment | |
| Validate | M8 Test & Validate + implementation review | G4 |
| Iterate | next increment / change request | |
| Govern | M9 Release & Handover | G5 |

## 5. Using it on ODC
The lifecycle, gates, spec and reviews apply unchanged on ODC, but the tooling differs: the hosted OutSystems MCP (generally available on every ODC tenant) lets the agent inspect the app, but **model changes are made by Mentor** on the agent's behalf; it also covers publish, impact checks, stage promotion, rollback, health and logs, all under the user's ODC roles and audit trail. On O11, by contrast, the agent writes the model itself (Model API on a copy) and Compare and Merge is the gate. The O11 capability matrix does **not** apply to ODC. Re-derive the marks from the ODC MCP documentation and the official `OutSystems/outsystems-mcp` skill before planning.
