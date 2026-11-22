# Increment <n> plan — <usable outcome>

> Build bottom-up; every task has a mark (`MWG-02`): MCP-R · MCP-W · MCP-W⚠ · MAN · REV.

## Approval (`MWG-10`)
Plan shown on <date>; approved by <user> on <date>. No model write before this line is filled.

## Scope
- Features: <F-xx>
- Stories: <US-xx>
- ACs: <AC-xx …>
- Out of scope: <…>

## Tasks
| ID | Phase | Module | Element | Change | Mark | ACs | Done check | Status |
|---|---|---|---|---|---|---|---|---|
| T01 | M4 | <D>_CS | Entity Request | create + attributes + index | MCP-W | AC-01 | read-back matches spec | todo |
| T02 | M4 | <D>_BL | dependency on <D>_CS | add + Apply | MAN | — | References probe OK | todo |
| T03 | M5 | <D>_BL | SubmitRequest | use case | MCP-W | AC-01, AC-02 | TrueChange clean | todo |
| T04 | M8 | all | publish CS→BL→CW→FE | publish | REV | — | versions noted | todo |

## Test plan
| AC | Level (component / API / UI / manual) | Test user role | Data needed | Automated? |
|---|---|---|---|---|

## Manual steps for the user
| ID | Step | Where | Owner | Needed before task |
|---|---|---|---|---|

## Risks
| Risk | Mitigation |
|---|---|
