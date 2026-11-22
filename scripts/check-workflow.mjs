#!/usr/bin/env node
// Checks an OutSystems AI Mentor state file (workflow-state.json) - Node.js 16+, no packages.
//   node scripts/check-workflow.mjs <workflow-state.json> [--gate G1|G2|G3|G4|G5] [--increment <id>] [--json]
// Without --gate it checks the gates the file claims to have passed, plus general consistency.
// With --gate it also checks whether that gate can pass now.
// Exit code: 0 = no errors, 1 = errors, 2 = usage or parse error.
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const json = args.includes("--json");
const gateArg = (args[args.indexOf("--gate") + 1] || "").toUpperCase();
const gateReq = args.includes("--gate") ? gateArg : null;
const incArg = args.includes("--increment") ? String(args[args.indexOf("--increment") + 1]) : null;
const file = args.find((a, i) => !a.startsWith("--") && !["--gate", "--increment"].includes(args[i - 1]));

if (!file || (gateReq && !/^G[1-5]$/.test(gateReq))) {
  console.error("usage: node scripts/check-workflow.mjs <workflow-state.json> [--gate G1..G5] [--increment <id>] [--json]");
  process.exit(2);
}
let s;
try { s = JSON.parse(readFileSync(file, "utf8").replace(/^﻿/, "")); }
catch (e) { console.error(`cannot read ${file}: ${e.message}`); process.exit(2); }

const findings = [];
const err = (rule, msg) => findings.push({ level: "error", rule, msg });
const warn = (rule, msg) => findings.push({ level: "warning", rule, msg });

const PHASES = ["M0", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9"];
const MARKS = ["MCP-R", "MCP-W", "MCP-W⚠", "MCP-W!", "MAN", "REV"];
const RESULTS = ["Pass", "Fail", "Blocked", "Not tested"];
const arr = (x) => (Array.isArray(x) ? x : []);
const gates = s.gates || {};
const passed = (g) => (gates[g] || {}).status === "passed";
const phaseIdx = PHASES.indexOf(s.phase);
const features = arr(s.features), acs = arr(s.acs), incs = arr(s.increments), questions = arr(s.questions), manual = arr(s.manualSteps);
const featureIds = new Set(features.map((f) => f.id));
const incIds = new Set(incs.map((i) => String(i.id)));

// ---- general ------------------------------------------------------------
if (!s.app) warn("MWG-05", "app name missing");
const plat = s.platform || {};
if (plat.name && plat.name !== "O11") warn("MWS-01", `platform is ${plat.name}: the O11 MCP capability matrix does not apply; re-derive marks`);
if (!plat.name) err("MWS-01", "platform.name missing (O11 expected)");
if (phaseIdx >= 4 && plat.environment && !/^dev/i.test(plat.environment)) err("MWS-01", `MCP writes planned against '${plat.environment}': writes are Development only`);
if (phaseIdx >= 4 && !plat.mcpContract) warn("MWS-01", "platform.mcpContract not recorded; check the capability matrix against the server's contract");
if (phaseIdx < 0) err("MWG-05", `phase '${s.phase}' is not one of ${PHASES.join(", ")}`);
if (phaseIdx >= 1 && !plat.toolSet) warn("MWS-05", "platform.toolSet not recorded (listApps / listOpenModules+searchApps / +openModule)");
if (phaseIdx >= 4 && !plat.environmentConfirmedBy) err("MWS-06", "environment not confirmed by the user (platform.environmentConfirmedBy): the MCP cannot tell which environment a module came from");

// agent change log
const agentLog = arr(s.agentLog);
const anyWriteDone = incs.some((i) => arr(i.tasks).some((t) => /^MCP-W/.test(t.mark || "") && t.status === "done"));
if (anyWriteDone && !agentLog.length) err("MWG-09", "MCP writes are done but agentLog is empty (the platform attributes agent changes to the developer)");
for (const [i, e] of agentLog.entries()) if (!e.module || !e.change || !e.date) warn("MWG-09", `agentLog entry ${i + 1}: needs date, module and change`);

// increment plan sign-off before writes
for (const inc of incs) {
  const pa = inc.planApproved || {};
  const started = arr(inc.tasks).some((t) => ["done", "in-progress", "doing"].includes(t.status)) || ["building", "testing", "accepted"].includes(inc.status);
  if (started && !(pa.date && pa.by)) err("MWG-10", `increment ${inc.id}: work started without an approved plan (planApproved date and by)`);
}

// gate order and approvals
const order = ["G1", "G2", "G3"];
for (const [i, g] of order.entries()) {
  if (passed(g)) {
    if (i > 0 && !passed(order[i - 1])) err("MWG-04", `${g} passed before ${order[i - 1]}`);
    if (!gates[g].date || !gates[g].by) err("MWG-04", `${g} passed without date and approver`);
  }
}
if (phaseIdx >= 2 && !passed("G1")) err("MWR-04", `phase ${s.phase} started but G1 (requirements ready) has not passed`);
if (phaseIdx >= 3 && !passed("G2")) err("MWP-07", `phase ${s.phase} started but G2 (spec approved) has not passed`);
if (phaseIdx >= 4 && !passed("G3")) err("MWA-06", `phase ${s.phase} started but G3 (architecture approved) has not passed`);
if (passed("G5") && !passed("G3")) err("MWG-04", "G5 passed before G3");

// questions
for (const q of questions) if (!["Blocker", "Major", "Minor"].includes(q.severity)) warn("MWR-04", `question ${q.id}: severity '${q.severity}' should be Blocker/Major/Minor`);

// manual steps
for (const m of manual) {
  if (!m.owner) err("MWG-06", `manual step ${m.id}: no owner`);
  if (!m.verify) warn("MWA-05", `manual step ${m.id}: no verification ("verify")`);
  if (!["todo", "done", "blocked", "verified"].includes(m.status)) warn("MWG-05", `manual step ${m.id}: status '${m.status}'`);
}

// tasks
for (const inc of incs) {
  for (const t of arr(inc.tasks)) {
    if (!MARKS.includes(t.mark)) err("MWG-02", `increment ${inc.id} task ${t.id}: mark '${t.mark}' must be one of ${MARKS.filter((m) => m !== "MCP-W!").join(", ")}`);
    if (t.mark === "MAN" && !t.owner && !t.manualStep) err("MWG-06", `increment ${inc.id} task ${t.id}: MAN task needs an owner or a manualStep reference`);
    if (t.manualStep && !manual.some((m) => m.id === t.manualStep)) err("MWG-06", `increment ${inc.id} task ${t.id}: manualStep ${t.manualStep} not in manualSteps`);
    if (!t.module) warn("MWG-02", `increment ${inc.id} task ${t.id}: no module`);
    if (/^MCP-W/.test(t.mark || "") && arr(t.acs).length === 0 && !t.enabling) warn("MWV-01", `increment ${inc.id} task ${t.id}: write with no AC (mark "enabling": true if it is infrastructure)`);
    for (const a of arr(t.acs)) if (!acs.some((x) => x.id === a)) err("MWV-01", `increment ${inc.id} task ${t.id}: unknown AC ${a}`);
  }
}

// ---- gate checks --------------------------------------------------------
function checkG1() {
  for (const q of questions) {
    if (q.status === "open" && q.severity === "Blocker") err("MWR-04", `G1: Blocker question ${q.id} is open`);
    if (q.status === "open" && q.severity === "Major") err("MWR-04", `G1: Major question ${q.id} is open (answer it or record an accepted assumption)`);
  }
  if (!features.length) err("MWR-02", "G1: no features in the requirements baseline");
  if (!acs.length) err("MWR-02", "G1: no acceptance criteria in the requirements baseline");
}
function checkG2() {
  for (const a of acs) {
    if (!a.feature || !featureIds.has(a.feature)) {
      if (a.priority === "Must") err("MWP-02", `G2: Must AC ${a.id} belongs to no known feature`);
      else warn("MWP-02", `G2: AC ${a.id} belongs to no known feature`);
    }
  }
  for (const f of features) {
    if (!arr(f.stories).length) warn("MWP-02", `G2: feature ${f.id} lists no stories`);
    if (!acs.some((a) => a.feature === f.id)) err("MWP-02", `G2: feature ${f.id} has no acceptance criteria`);
    if (f.increment == null) err("MWP-08", `G2: feature ${f.id} is not assigned to an increment`);
    else if (!incIds.has(String(f.increment))) err("MWP-08", `G2: feature ${f.id} is in increment ${f.increment}, which does not exist`);
  }
  if (!incs.length) err("MWP-08", "G2: no increments planned");
  if (passed("G2") && !gates.G2.specVersion) warn("MWP-07", "G2: approved spec version not recorded");
}
function checkG3() {
  const pend = manual.filter((m) => m.phase === "M3" && !["done", "verified"].includes(m.status));
  for (const m of pend) err("MWA-06", `G3: manual setup step ${m.id} (${m.step || ""}) is ${m.status}`);
  if (!manual.some((m) => m.phase === "M3")) warn("MWA-04", "G3: no manual setup steps listed for M3 (modules, dependencies); confirm none are needed");
}
function checkG4(inc) {
  const incAcs = acs.filter((a) => arr(inc.features).includes(a.feature));
  const res = new Map(arr(inc.results).map((r) => [r.ac, r]));
  if (!incAcs.length) err("MWT-07", `G4 increment ${inc.id}: no acceptance criteria in scope`);
  for (const a of incAcs) {
    const r = res.get(a.id);
    if (!r) { err("MWT-03", `G4 increment ${inc.id}: AC ${a.id} has no test result`); continue; }
    if (!RESULTS.includes(r.result)) err("MWT-07", `G4 increment ${inc.id}: AC ${a.id} result '${r.result}'`);
    else if (r.result === "Pass" && !r.evidence) err("MWT-07", `G4 increment ${inc.id}: AC ${a.id} Pass without evidence`);
    else if (r.result !== "Pass" && !(r.owner && r.reason)) err("MWT-07", `G4 increment ${inc.id}: AC ${a.id} ${r.result} needs owner and reason`);
    if (r.result === "Fail" && a.priority === "Must") err("MWT-07", `G4 increment ${inc.id}: Must AC ${a.id} failed`);
  }
  for (const t of arr(inc.tasks)) if (!["done", "dropped"].includes(t.status)) err("MWT-07", `G4 increment ${inc.id}: task ${t.id} is ${t.status}`);
  const rv = inc.review || {};
  if (!rv.done) err("MWV-01", `G4 increment ${inc.id}: implementation review not done`);
  if (rv.openBlockers > 0) err("MWV-01", `G4 increment ${inc.id}: ${rv.openBlockers} open Blocker finding(s) in the review`);
  if (rv.trueChangeErrors > 0) err("MWT-01", `G4 increment ${inc.id}: ${rv.trueChangeErrors} TrueChange error(s)`);
  if (!["no-new", "accepted", "fixed"].includes(rv.mentorStudio)) warn("MWV-07", `G4 increment ${inc.id}: AI Mentor Studio scan is '${rv.mentorStudio || "not-run"}' (recurrent scans catch debt early)`);
  const needed = new Set(arr(inc.tasks).map((t) => t.manualStep).filter(Boolean));
  for (const m of manual) if (needed.has(m.id) && !["done", "verified"].includes(m.status)) err("MWG-06", `G4 increment ${inc.id}: manual step ${m.id} is ${m.status}`);
  if (inc.gate && inc.gate.status === "passed" && !(inc.gate.date && inc.gate.by)) err("MWG-04", `G4 increment ${inc.id}: passed without date and approver`);
}
function checkG5() {
  for (const inc of incs) if (!(inc.gate && inc.gate.status === "passed")) err("MWV-06", `G5: increment ${inc.id} has not passed G4`);
  const rel = s.release || {};
  if (rel.regression !== "passed") err("MWV-02", `G5: regression is '${rel.regression || "not-run"}'`);
  if (!["no-new", "accepted"].includes(rel.mentorStudio)) err("MWV-03", `G5: AI Mentor Studio result is '${rel.mentorStudio || "not-run"}' (no-new or accepted expected)`);
  if (!rel.deploymentPlan) warn("MWV-04", "G5: no deploymentPlan reference in release");
  const open = manual.filter((m) => !["done", "verified"].includes(m.status) && m.phase !== "M9");
  for (const m of open) warn("MWV-05", `G5: manual step ${m.id} still ${m.status}; list it in the handover`);
  if (passed("G5") && !(gates.G5.date && gates.G5.by)) err("MWG-04", "G5 passed without date and approver");
}

if (passed("G1") || gateReq === "G1") checkG1();
if (passed("G2") || gateReq === "G2") checkG2();
if (passed("G3") || gateReq === "G3") checkG3();
for (const inc of incs) {
  const want = gateReq === "G4" && (incArg === null ? inc.status !== "planned" : String(inc.id) === incArg);
  if ((inc.gate && inc.gate.status === "passed") || want) checkG4(inc);
  if (inc.gate && inc.gate.status === "passed" && inc.status !== "accepted") warn("MWG-05", `increment ${inc.id}: gate passed but status '${inc.status}'`);
}
if (gateReq === "G4" && incArg !== null && !incIds.has(incArg)) err("MWG-05", `increment ${incArg} not found`);
if (passed("G5") || gateReq === "G5") checkG5();

// ---- output -------------------------------------------------------------
const errors = findings.filter((f) => f.level === "error");
const summary = {
  file, app: s.app || null, phase: s.phase || null, gate: gateReq,
  gates: Object.fromEntries(["G1", "G2", "G3", "G5"].map((g) => [g, (gates[g] || {}).status || "open"])),
  increments: incs.map((i) => ({ id: i.id, status: i.status, gate: (i.gate || {}).status || "open" })),
  errors: errors.length, warnings: findings.length - errors.length,
};
if (json) console.log(JSON.stringify({ summary, findings }, null, 2));
else {
  console.log(`${summary.app || "(no app)"} — phase ${summary.phase} — gates ${Object.entries(summary.gates).map(([k, v]) => `${k}:${v}`).join(" ")}` +
    (incs.length ? ` — increments ${summary.increments.map((i) => `${i.id}:${i.status}/${i.gate}`).join(" ")}` : ""));
  for (const f of findings) console.log(`${f.level === "error" ? "error  " : "warning"} ${f.rule}  ${f.msg}`);
  console.log(errors.length ? `FAILED: ${errors.length} error(s), ${summary.warnings} warning(s)` : `OK${gateReq ? ` (${gateReq} can pass)` : ""}: ${summary.warnings} warning(s)`);
}
process.exit(errors.length ? 1 : 0);
