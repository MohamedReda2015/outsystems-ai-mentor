# Architecture Design — <App name>

> Owner: outsystems-architecture. Approve at G3 (`MWA-06`).

## Module map (`MWA-01`)
| Module | Canvas layer | Type (Reactive / Service / Library) | App | Owner | Purpose | New / existing |
|---|---|---|---|---|---|---|
| <D>_Front_End | End-User | Reactive | | | | |
| <D>_CW | Core | Reactive | | | | |
| <D>_BL | Core | Service | | | | |
| <D>_CS | Core | Service | | | | |
| <D>_IS | Foundation | Service | | | | |

## Dependencies (`MWA-02`)
| Consumer | Producer | Elements used | Strong / weak | Verified in `eSpace.References` (`MWA-05`) |
|---|---|---|---|---|

Validator result: <command and output summary>

## Apps and release cadence (`MWA-03`)
| App | Modules | Owner | Release cadence | Shared with |
|---|---|---|---|---|

## Security design
Roles per module, server-side checks, exposed endpoints and their authentication.

## Manual setup (`MWA-04`)
See `manual-steps.md`: create apps/modules, module types, dependencies (Apply), Forge, theme base, site properties.

## MCP plan
| Module | Size concern | Timeout set | Edit approach (MCP-W / small-module + manual drop-in) |
|---|---|---|---|

## Approval
| Date | Approved by | Notes |
|---|---|---|
