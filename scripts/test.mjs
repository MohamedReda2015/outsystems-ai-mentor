#!/usr/bin/env node
// Regression tests for scripts/check-workflow.mjs (Node.js 16+, no packages).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const run = (...a) => {
  const r = spawnSync(process.execPath, [join(HERE, "check-workflow.mjs"), ...a, "--json"], { encoding: "utf8" });
  let out = null;
  try { out = JSON.parse(r.stdout); } catch { /* usage errors print text */ }
  return { code: r.status, out };
};
const ex = (f) => join(HERE, "examples", f);
const tpl = join(HERE, "..", "templates", "workflow-state.json");
let fails = 0;
const t = (name, ok) => { console.log(`${ok ? "ok  " : "FAIL"} ${name}`); if (!ok) fails++; };
const rules = (r) => new Set((r.out?.findings || []).filter((f) => f.level === "error").map((f) => f.rule));

const good = run(ex("good-state.json"));
t("good state passes", good.code === 0 && good.out.summary.errors === 0);
t("good state: G4 for increment 2 can pass", run(ex("good-state.json"), "--gate", "G4", "--increment", "2").code === 0);
const g5 = run(ex("good-state.json"), "--gate", "G5");
t("good state: G5 not yet (increment 2, regression, Mentor Studio)", g5.code === 1 && ["MWV-06", "MWV-02", "MWV-03"].every((r) => rules(g5).has(r)));

const bad = run(ex("bad-state.json"));
const br = rules(bad);
for (const r of ["MWS-01", "MWG-04", "MWP-07", "MWG-06", "MWG-02", "MWV-01", "MWR-04", "MWA-06", "MWT-07"]) t(`bad state flags ${r}`, br.has(r));
t("bad state exits 1", bad.code === 1);

for (const r of ["MWS-06", "MWG-10"]) t(`bad state flags ${r}`, br.has(r));
const bg2 = run(ex("bad-state.json"), "--gate", "G2");
t("bad state --gate G2 flags MWP-09 (unknown role, screen without role)", rules(bg2).has("MWP-09"));
const gg2 = run(ex("good-state.json"), "--gate", "G2");
t("good state --gate G2 passes the spec check", gg2.code === 0);
t("bad state flags MWG-09 (writes without change log)", br.has("MWG-09"));

const tg1 = run(tpl, "--gate", "G1");
t("template: G1 blocked by open Blocker question", tg1.code === 1 && rules(tg1).has("MWR-04"));
t("template: no gate errors without --gate", run(tpl).code === 0);
t("usage error exits 2", spawnSync(process.execPath, [join(HERE, "check-workflow.mjs")], { encoding: "utf8" }).status === 2);
t("bad gate name exits 2", run(ex("good-state.json"), "--gate", "G9").code === 2);

console.log(fails ? `FAILED: ${fails}` : "all tests passed");
process.exit(fails ? 1 : 0);
