# Increment <n> review — implementation review before G4

> `MWV-01`. Guide: `references/reviews-and-validation.md` §2.

## A. Requirements coverage
| AC | Rule IDs | Elements | Test | Result |
|---|---|---|---|---|
Elements without an AC (justify or remove): <…>

## B. Acceptance criteria results
| AC | Result (Pass / Fail / Blocked / Not tested) | Evidence (what, where, as whom, version) | Defect / owner |
|---|---|---|---|

## C. Standards findings
| Rule ID | Evidence | Fix | Status |
|---|---|---|---|

## D. MCP hygiene
- [ ] All merges reviewed in Compare and Merge; no open edit session
- [ ] Publish state per module: <module: version>
- [ ] MCP-W⚠ items verified after publish (served CSS, process review)
- [ ] TrueChange: 0 errors, no new warnings in touched modules
- [ ] No secrets typed; no real data in defaults or test data
- [ ] Flows laid out before merge (`MWG-11`); agent change log complete (`MWG-09`)
- [ ] No stale edit session after human edits or partial merges (`MWG-08`)
- [ ] Code Quality (formerly AI Mentor Studio) scan done; new findings fixed Security → Performance → Architecture → Maintainability (`MWV-07`)
- [ ] Automated tests in the test module only (`MWT-09`)

## E. Manual steps
| ID | Step | Owner | Status |
|---|---|---|---|

## F. Lessons
- <what slowed us → what changes next increment>

## Verdict
G4: pass / not yet — <reason>. Approved by <user> on <date>.
