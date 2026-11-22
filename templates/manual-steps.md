# Manual steps (MAN) and approvals (REV)

> The MCP cannot do these (`references/mcp-capability-matrix.md`). The agent writes exact steps; the owner does them and says "done"; the agent verifies (`MWG-06`, `MWA-05`).

| ID | Phase / task | Step (exact clicks / values) | Where | Owner | Verify by | Status |
|---|---|---|---|---|---|---|
| MS-01 | M3 | Create Reactive app `<App>`; add modules `<D>_CS` (Service), `<D>_BL` (Service), `<D>_CW` (Reactive), `<D>_Front_End` (Reactive) | Service Studio | user | `searchApps` lists them | todo |
| MS-02 | M3 | In `<D>_BL`: Manage Dependencies → `<D>_CS` → tick all entities → **Apply** → publish | Service Studio | user | restart edit session; `eSpace.References` shows `<D>_CS` | todo |
| MS-03 | M7 | Export translations, fill AR, import | Service Studio | user | language pass test | todo |
| MS-04 | M6 | Set site property `<Name>` value per environment | Service Center | user | integration call evidence | todo |
| MS-05 | M8 | Assign roles to test users `<test.user.a>` … | Users app | user | role journey tests | todo |
| MS-06 | M9 | Deploy `<App>` Dev → Test | LifeTime | user | version in Test | todo |
