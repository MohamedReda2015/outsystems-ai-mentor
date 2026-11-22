# Writing the App Specification (M2, gate G2)

The App Specification is this skill's version of the spec Mentor shows before it generates an app. It is short, structured, approved by the user, and every later element traces back to it. Template: `templates/app-specification.md`.

## Principles
- **One page first**: the summary (purpose, roles, features per increment, entities, screens, integrations, risks) must fit on one screen; detail sections follow.
- **Traceable**: every feature lists story and AC IDs from the requirements baseline; every entity, screen and use case lists the features that need it. An element with no feature is scope creep; a Must AC with no feature is a gap (`MWP-02`).
- **Logical, not physical**: name business concepts and their rules; module placement comes in M3. Use the glossary's terms exactly.
- **Unknowns visible**: `TBC` with the question ID, never a guess (`MWR-03`).

## Sections and what "good" looks like

### 1. Purpose and outcome
Two sentences: the problem today, and how the business will measure success.

### 2. Personas and roles (`MWP-01`)
| Persona | Platform role | Can see | Can do | Must not |
|---|---|---|---|---|
| Requester | `Requester` | own requests | create, submit, resubmit | see others' requests |
Include "System" actors (timers, integrations) and administrators of lookups.

### 3. Logical data model (`MWP-03`)
For each entity: purpose, key attributes (name, type, length, mandatory), relationships with cardinality and delete behaviour, lookup kind (**Static** only if code branches on the value; **Lookup entity** when the business maintains the list), audit columns, soft delete, expected volume and growth, retention. Add an ER sketch (Mermaid or table) and sample-data needs (fictional only).

### 4. Feature map (`MWP-02`)
| Feature | Stories | ACs | Priority | Increment |
|---|---|---|---|---|

### 5. Screen inventory and navigation (`MWP-04`)
| Screen | Purpose | Roles | Entry point | Pattern | Blocks | States |
|---|---|---|---|---|---|---|
Patterns from the style guide (list with filters, detail with tabs, wizard, dashboard, popup form…). A navigation map shows the path back to each entry point.

### 6. Logic inventory (`MWP-05`)
- **Use cases**: name, actor, rules applied (IDs), entities written, side effects (notification, history, integration).
- **State machine**: one table for the app — from, to, action, actor, guard, side effects. Statuses use one name everywhere.
- **Asynchronous steps**: what triggers them and the mechanism (timer, Light BPT, BPT, CMF, outbox) chosen with outsystems-bpt `PDS-01`.

### 7. Integrations (`MWP-06`)
System, operation, direction, sync/async, data exchanged, failure behaviour, test environment available (yes/no), owner of credentials.

### 8. Non-functional requirements (`MWP-06`)
Security (authentication, roles, data sensitivity), performance (volumes, response targets), accessibility (WCAG 2.2 AA), languages and RTL, audit and retention, availability.

### 9. Increments (`MWP-08`)
| # | Goal (usable outcome) | Features | Depends on | Main risks | Expected MAN steps |
|---|---|---|---|---|---|
See `references/incremental-delivery.md`.

### 10. Open questions and assumptions
Question ID, text, severity, recommendation, status.

## Review questions before asking for approval
- Can every Must AC be traced to a feature, and every feature to at least one screen or use case?
- Does every status in the state machine have an action that enters it and one that leaves it (except final states)?
- Does every role appear on at least one screen, and every screen have at least one role?
- Is every user-maintained list an entity with an admin screen or an explicit "maintained by script" decision?
- Is every integration's failure behaviour written down?
- Is increment 1 small enough to finish and demo in days, not weeks?

## Approval (G2)
Show the one-page summary; offer the detail; list what the user is approving (roles, data model, screens, logic, increments) and what is still TBC. Record the approval with date and approver in `workflow-state.json` (`gates.G2`).
