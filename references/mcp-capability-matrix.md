# O11 MCP capability matrix: what the agent can do, and what needs a human

Source: the official OutSystems 11 MCP product update and repository (OutSystems/outsystems11-mcp, `servicestudio-mcp-oml` skill: "Capability status", "Known gaps", `reference/contracts.md`, `reference/mcp-design-choices.md`), community Ideas and forum threads (marked *community*), plus behaviour verified by test on real O11 projects in late 2026 (marked *verified*). Service Studio 11.55.91+. The official skill is now written for **MCP contract 2** (as of its 2026-11-20 update) and keeps notes for contract 1 builds; the server names its contract when the agent connects (a server that names none speaks contract 1). **Re-check this table whenever the contract number changes** (`MWS-01`).

> The house-wide detail (governance, edit sessions, timeouts, manual-only steps, Model API pitfalls, CSS verification) lives in the shared MCP reference of **outsystems-architecture** (its `service-studio-mcp` reference, rule `OPS-10`). This matrix keeps the lifecycle view: which mark each task gets. When the two differ, re-check both against the server's contract and update them together.

## Status by app type (official product update)
| App type | Read | Write |
|---|---|---|
| Reactive Web, Mobile (and their libraries, Service modules) | **GA** | Beta |
| Traditional Web | **Beta** (use the `*Traditional` read variants) | Beta |
So on Traditional Web even an MCP-R step is Beta: confirm read results in Service Studio before designing on them.

## Tool sets by contract and build (official) (`MWS-05`)
| Server advertises | Service Studio builds | Consequence |
|---|---|---|
| `listApps` only | early 11.55.9x builds | no `searchApps`/`openModule`: the user opens modules; `tabId` may be missing |
| `listOpenModules` + `searchApps` | from 11.55.98 | the agent can list the environment's modules but not open them |
| + `openModule` / `closeModule` | from 11.55.99 | the agent can open and close modules itself |
| contract 2 (next Service Studio release) | — | the tool set the official skill now describes (`listOpenModules`, `searchApps`, `openModule`, `closeModule`); install the matching official skill when the server reports it |
Check the live tool list and the reported contract at M0; where a live tool description differs from the official skill, trust the description. When both the O11 and ODC MCP servers are connected, ask which platform before any call (`MWS-07`).

## Marks

| Mark | Meaning | Who acts | Approval |
|---|---|---|---|
| **MCP-R** | Read tool, Generally Available. Leaves the module unchanged. | agent | none |
| **MCP-W** | Model write through `applyModelApiCode` (Beta). Staged on a copy; accepted in Compare and Merge. | agent, human reviews merge | per the developer's *Write permissions* setting (team standard: manual review) |
| **MCP-W⚠** (ASCII: `MCP-W!`) | Beta write with a known gap. Do it, then **verify the published result**; keep the manual fallback ready. | agent + human | as MCP-W |
| **MAN** | No MCP tool. Human in Service Studio, Service Center, LifeTime, Users app, Code Quality (formerly AI Mentor Studio) or a browser. | human (agent prepares exact steps) | n/a |
| **REV** | The agent can do it, but a human must approve first. | agent after a yes | explicit yes each time (`MWG-04`) |

## The tool flow (MCP-W)
`listOpenModules` (find the module and `tabId`) → `startOmlEditSession` → small `applyModelApiCode` calls, one concern each → after each: `exceptionMessage` empty and `getValidationMessages` without new errors → read back with `get*` → `omlMerge` (Compare and Merge) → `endOmlEditSession`. Publish (`omlPublish`) only on the user's yes; it ends the edit session. One call per module at a time: parallel calls fail with "OML not found" (*verified*). Before `omlMerge`, lay out every flow you created or changed — the official skill treats flow layout as a completion gate (`MWG-11`). The exact lambda contract is in the official skill — follow it, don't guess.

### Edit-session facts (official design notes) (`MWG-08`)
- `startOmlEditSession` copies the module; the agent edits and reads **that copy**. Changes the user makes in Service Studio meanwhile are **invisible** to the agent, and a merge does not refresh the copy.
- If the user rejects a merge or accepts only part of it, the copy still holds the rest and the next merge proposes it again. End the session and start a new one from what was accepted.
- `endOmlEditSession` deletes the copy and its unmerged edits; `omlReset` discards unmerged edits and ends the session (does nothing if there are none).
- Sessions live in Service Studio: they outlast the conversation and are **shared by every agent connected** to that Service Studio. One writer per module.
- Starting Service Studio wipes its MCP temp folder: copy out anything to keep before a restart.
- The server starts only when the user starts it (Edit > MCP Server); `ConnectionRefused` means "not started", not "broken".

### Timeouts and large modules (`MWA-07`)
- Official defaults: reads time out at **120 s**, writes at **300 s**; default port 41820.
- On very large modules even name-listing reads can exceed 120 s (*community, verified on our projects*). Options, in order: raise the read/write timeout in the MCP Server dialog and call through a script with a longer client timeout; for **analysis only**, a community workaround runs Service Studio's own oml tooling read-only on an exported `.oml` snapshot (unofficial, snapshot goes stale, never write to it); for **changes**, build the new piece in a small module and let the user wire it into the large one by hand (MAN).

### Governance gaps (community Ideas, staff "evaluating") (`MWS-06`, `MWG-09`)
- LifeTime has **no MCP setting**: write permissions live in each developer's Service Studio, and the agent inherits the developer's rights — if the developer can publish to Test, so can the agent.
- The MCP does not tell which environment an open module came from (it sees only the loopback address). Confirm the environment with the user; `searchApps` names its environment on builds that have it.
- Agent changes are attributed to the developer in Service Center/LifeTime: keep an agent change log in the workflow state.
- Every connection (including reconnects) shows an approval prompt; the client name in it is self-reported, so approve only agents you started.

## Capability by lifecycle step

### Setup and discovery (M0, M3)
| Task | Mark | Notes |
|---|---|---|
| List open modules, module type, loaded references | MCP-R | `listOpenModules` (`listApps` on early contract-1 builds) |
| Find modules in the environment, grouped by app | MCP-R | `searchApps`; names the environment |
| Open / close a module in Service Studio | MCP-R / host tool | `openModule`, `closeModule` where available; otherwise MAN |
| Module overview, documentation, dependency map, risk scan | MCP-R | AI interpretation: confirm facts by reading the element (`MWS-02`). The map covers the **open module only**: open consumers yourself |
| Create a new application or module, set its type and icon | **MAN** | Service Studio → New Application / New Module |
| Classify modules in Discovery / Code Quality | **MAN** | |
| **Add a dependency** (other module, Forge, System element) | **MAN** | Manage Dependencies → tick → **Apply**. The tool fails with `ResolveModuleSignature must be set first`. After the user adds it, end and restart the edit session, then probe `eSpace.References` (*verified*: users said "done" before Apply) |
| Refresh existing references to the latest producer version | MCP-W (REV) | `omlRefreshReferences`; then publish the consumer |
| Install a Forge component | **MAN** | |
| Extensions (Integration Studio C#) | **MAN** | |

### Data model (M4)
| Task | Mark | Notes |
|---|---|---|
| Read entities, attributes, FKs | MCP-R | `getDataModel`, `runQuery` |
| Server entity, attributes, Id + AutoNumber, identifier | MCP-W | New entities have **no attributes**: create Id, set `IsAutoNumber`, set `IdentifierAttribute` |
| Public, Expose Read-Only, FK with delete rule, index (unique) | MCP-W | |
| Static entity and records | MCP-W | `Entities.<Static>.<Record>` resolves in a consumer only when the static entity is an explicit dependency |
| Entity actions (CreateOrUpdate…) as CRUD wrappers | MCP-W | wrapper actions are created by the agent |
| Folders for entities | MCP-W | use `ServerEntities` folder kind |
| Load real data / run SQL on the database | **MAN** | `runQuery` is **ModelQL over the model**, not a database query |
| Seed data | MCP-W + app | ensure-action built by the agent; run it in the app and verify (`MWD-04`) |

### Business logic (M5)
| Task | Mark | Notes |
|---|---|---|
| Read actions, structures, exceptions, roles, timers | MCP-R | `getServerAction`, `getStructures`, `getUserExceptions`, `getRoleNames`, `getTimers` |
| Structures, server/service actions, aggregates, SQL nodes, If/ForEach/Assign, exception handlers, user exceptions | MCP-W | Service Actions and some Server Actions come **without Start/End nodes**: create them |
| Roles and `Check<Role>Role` in server logic | MCP-W | not accepted in client expressions by the validator |
| Site properties (definition) | MCP-W | **values per environment are MAN** in Service Center; keep secret defaults empty |
| Timers | MCP-W | verify schedule and timeout after publish; activation per environment is MAN |
| BPT processes | MCP-W⚠ | O11 API is `eSpace.CreateProcess` (hand-verified reference in the official skill); **not** `CreateBusinessProcess` (ODC). Review the flow in Service Studio |
| CMF case definitions | MCP-W + MAN | configuration data and bootstrap actions; follow outsystems-cmf |
| Email templates | MCP-W | content review is REV |
| Record List To Excel output | MCP-W⚠ | output can't be referenced: generate CSV in a server action instead |

### Integrations (M6)
| Task | Mark | Notes |
|---|---|---|
| Consume REST (methods, structures) | MCP-W | importing from a large Swagger is faster by hand (MAN); either way prove with a real call |
| Expose REST API | MCP-W | add authentication in logic; **`CrossSiteRequests = Restrict` has no runtime effect**: CORS must be enforced elsewhere |
| SOAP, SAP, database connections | MAN | connections and credentials in Service Center |
| Test a call against the real endpoint | MAN / app | "Test" tab in Service Studio or a test screen; record the evidence (`MWI-02`) |
| Endpoint URLs, keys, certificates per environment | **MAN** | the agent never types secrets (`MWI-03`) |

### Screens and UI (M7)
| Task | Mark | Notes |
|---|---|---|
| Read screens, blocks, widgets | MCP-R | some screens return empty from `getScreen`: walk them with `GetAllDescendantsOfType<T>()` in a read-only probe (*verified*). Traditional modules: `*Traditional` read variants |
| Flows, screens, blocks, widgets, screen/client actions, data actions, events, client variables | MCP-W | new blocks are **not public**: set `Public = true` before consumers use them; widget sequences can be reordered |
| Roles on screens, menu entries, navigation | MCP-W | |
| Theme stylesheet | MCP-W | theme edits publish reliably |
| Block/screen stylesheet that is **not empty** | MCP-W⚠ | merge says merged, publish may ship old CSS. Prefer the theme; or recreate a small style-only block; **always fetch the served CSS** after publish (`MWT-02`) |
| Theme icon library | MCP-W⚠ | leave null on contract 1 |
| **Translations** | **MAN** | locales can be created, translated values **cannot be written**: Service Studio export/import |
| Images and resources | MCP-R read; upload MAN | |

### Validation, test, publish and deploy (M8, M9)
| Task | Mark | Notes |
|---|---|---|
| TrueChange errors and warnings | MCP-R | `getValidationMessages` with filter |
| Compare and Merge review | REV | the human reviewer is the agent's quality gate |
| Undo | MCP-W (limited) | no "rewind": `omlReset` drops the whole unmerged chain and can't be undone |
| Publish to Development | REV | `omlPublish` on the user's yes; if the tool wrapper rejects it for a missing token, the documented fallback is a direct call to the local endpoint with the session token |
| Run the app, test ACs, walk role journeys | MAN or browser automation | the MCP does not run the app |
| BDDFramework tests | MCP-W build, run MAN/browser | in a dedicated test module/app, never deployed to Production (`MWT-09`); the Forge component is a dependency the user adds (MAN) |
| Code Quality (code quality, security, performance, architecture, deprecated elements) scan | **MAN** | run per increment (`MWV-07`); an MCP-R "risk scan" is a useful pre-check, not a replacement |
| Assign roles to test users | **MAN** | Users app |
| Deploy to Test/Acceptance/Production | **MAN** | LifeTime only; never by the agent; restrict agent work to Development |
| Rollback | **MAN** | LifeTime |
| Convert a Traditional Web module to Reactive | **MAN** | Service Studio › Module › Convert to Reactive (GA, clones the module); the agent then does the cleanup with MCP-W (`MWA-08`) |
| Measure screen performance | **MAN** / browser | Performance Analytics (Beta, manual activation; client, network, server breakdown, APDEX, linked to Code Quality) or browser timings (`MWT-10`) |

## Before relying on a capability
1. Check the contract number and the official skill's "Known gaps" and "Common mistakes" for the user's Service Studio version.
2. Try it with a read-only probe (code that throws its findings without changing anything) on the real module.
3. If it fails twice in the same way, stop, mark the task MAN, and write the manual steps (`MWG-06`).

## Security caveat (official)
`applyModelApiCode` runs agent-written C# with the host's privileges: use it only on modules the user owns, never on code derived from untrusted module content, and keep the agent's session log as the record of *which* changes it made (Service Center attributes them to the developer).
