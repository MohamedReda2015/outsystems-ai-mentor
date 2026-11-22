#!/usr/bin/env node
// Consistency checks for the outsystems-ai-mentor skill (Node.js 16+, no packages).
//   node scripts/check_skill.mjs
// Exit code: 0 = all checks pass, 1 = at least one error.
// Private client names to ban can be listed one per line in a git-ignored `.private-names`
// file at the skill root, or in the PRIVATE_NAMES environment variable (comma-separated).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const errors = [];
const warnings = [];
const read = (p) => readFileSync(join(ROOT, p), "utf8");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if ([".git", "node_modules"].includes(name) || name === ".private-names") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(relative(ROOT, full).split(sep).join("/"));
  }
  return out;
}
const files = walk(ROOT);
const textFiles = files.filter((f) => /\.(md|mdc|mjs|json|yml|txt)$/.test(f) || !f.includes("."));

// 1. SKILL.md frontmatter and size
const skill = read("SKILL.md").replace(/\r\n/g, "\n");
const fm = skill.match(/^---\n([\s\S]*?)\n---/);
let version;
if (!fm) errors.push("SKILL.md: missing YAML frontmatter");
else {
  const get = (k) => (fm[1].match(new RegExp(`^${k}:\\s*(.*)$`, "m")) || [])[1];
  const name = get("name"), desc = get("description"), lic = get("license");
  version = (fm[1].match(/^\s+version:\s*(\S+)/m) || [])[1];
  if (!name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) errors.push(`SKILL.md: invalid name '${name}'`);
  if (!desc) errors.push("SKILL.md: missing description");
  else if (desc.length > 1024) errors.push(`SKILL.md: description is ${desc.length} chars (max 1024)`);
  if (/[<>]/.test(desc || "")) errors.push("SKILL.md: description must not contain angle brackets");
  if (!lic) warnings.push("SKILL.md: no license field");
  if (!version || !/^\d+\.\d+\.\d+$/.test(version)) errors.push(`SKILL.md: metadata.version '${version}' is not semver`);
  else if (!existsSync(join(ROOT, "CHANGELOG.md")) || !read("CHANGELOG.md").includes(`## ${version}`)) errors.push(`CHANGELOG.md: no entry for version ${version}`);
  if (existsSync(join(ROOT, "package.json"))) {
    const pv = JSON.parse(read("package.json")).version;
    if (pv !== version) errors.push(`package.json version ${pv} differs from SKILL.md ${version}`);
  }
}
const skillLines = skill.split("\n").length;
if (skillLines > 500) errors.push(`SKILL.md: ${skillLines} lines (max 500)`);
else if (skillLines > 300) warnings.push(`SKILL.md: ${skillLines} lines (aim for < 300)`);

// 2. Referenced paths exist
const pathRe = /\b((?:references|templates|scripts|adapters|evals|research)\/[A-Za-z0-9_./-]+\.(?:md|mjs|json|mdc))\b(?!` there)/g;
for (const f of files.filter((x) => /\.(md|mdc)$/.test(x))) {
  for (const m of read(f).matchAll(pathRe)) {
    if (m[1].includes("*") || m[1].includes("<")) continue;
    if (!existsSync(join(ROOT, m[1]))) errors.push(`${f}: references missing file ${m[1]}`);
  }
}

// 3. Rule IDs: own rules defined once; lessons once; every cited ID known
const checklist = read("references/review-checklist.md");
const defined = [...checklist.matchAll(/^\| ([A-Z]+-\d+) \|/gm)].map((m) => m[1]);
const dup = defined.filter((id, i) => defined.indexOf(id) !== i);
if (dup.length) errors.push(`review-checklist.md: duplicate rule IDs ${[...new Set(dup)].join(", ")}`);
const lessons = [...read("references/lessons-learned.md").matchAll(/\*\*(MLL-\d+)\b/g)].map((m) => m[1]);
const dupL = lessons.filter((id, i) => lessons.indexOf(id) !== i);
if (dupL.length) errors.push(`lessons-learned.md: duplicate lesson IDs ${[...new Set(dupL)].join(", ")}`);
const known = new Set([...defined, ...lessons]);

// Rule ID ranges of the companion skills (architecture v2.0.0, backend v1.2.0, frontend v1.1.0,
// style guide v2.0.0, bpt v1.2.0, cmf v1.1.1, brd-analysis v1.2.0, user-story v1.1.1). Update when they add IDs.
const COMPANION = {
  ARC: 14, HSE: 6, DAT: 12, INT: 7, UI: 8, SEC: 14, AUD: 3, MNT: 9, OPS: 10, TST: 4,
  BNM: 8, BLG: 13, BTX: 7, BDA: 15, BIN: 12, BER: 8, BAS: 10, BPF: 9, BSC: 12, BCF: 4,
  NAM: 7, STR: 4, BLK: 9, NAV: 5, LCY: 7, FET: 6, STA: 5, CLG: 8, VAL: 8, ERR: 6, JSC: 19, FSC: 7, FPF: 6, MOB: 7, LOC: 3, VER: 2,
  TOK: 11, THM: 12, LAY: 7, RSP: 8, CMP: 5, FRM: 5, LST: 5, FDB: 5, TXT: 5, PRF: 4, GOV: 6,
  PAR: 9, PDS: 10, PHA: 10, PAA: 6, PLT: 5, PEX: 5, PVR: 8, POP: 4, PSC: 3, PNM: 5,
  CAR: 10, CDF: 11, CST: 9, CAC: 11, CSC: 10, CSL: 10, CUI: 9, COP: 11,
  BRI: 10, BRX: 17, BRQ: 16, BRC: 8, BRS: 10, BRM: 13, BRT: 3, BRR: 9,
  RQA: 18, RQV: 8, RQC: 8, RQP: 11, RQI: 13, RQT: 13, RQD: 8, RLL: 30,
};
for (const [p, n] of Object.entries(COMPANION)) for (let i = 1; i <= n; i++) known.add(`${p}-${String(i).padStart(2, "0")}`);
for (const i of [1, 4, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]) known.add(`PERF-${String(i).padStart(2, "0")}`);
const OWN = ["MWS", "MWR", "MWP", "MWA", "MWD", "MWL", "MWI", "MWU", "MWT", "MWV", "MWG", "MLL"];
const prefixes = [...OWN, ...Object.keys(COMPANION), "PERF"];
const idRe = new RegExp(`\\b(${prefixes.join("|")})-(\\d+)\\b`, "g");
const skipIds = new Set(["scripts/check_skill.mjs"]);
for (const f of files.filter((x) => /\.(md|mdc|mjs|json)$/.test(x) && !x.startsWith(".github/") && !skipIds.has(x) && !x.startsWith("scripts/examples/"))) {
  for (const m of read(f).matchAll(idRe)) {
    // register-template rows (INT-01, AUD-01 as register IDs) are valid companion IDs too; nothing to skip
    if (!known.has(m[0])) errors.push(`${f}: cites undefined rule ${m[0]}`);
  }
}
// every own rule is used outside the checklist at least once (warn)
const corpus = files.filter((x) => /\.(md|mjs)$/.test(x) && x !== "references/review-checklist.md").map(read).join("\n");
for (const id of defined) if (!corpus.includes(id)) warnings.push(`${id} is defined but never cited outside the checklist`);

// 4. Adapters carry the core-rules block, identical to adapters/core-rules.md
const core = existsSync(join(ROOT, "adapters/core-rules.md")) ? read("adapters/core-rules.md").replace(/\r\n/g, "\n") : "";
const block = (t) => (t.match(/<!-- BEGIN core rules -->[\s\S]*?<!-- END core rules -->/) || [""])[0];
if (!block(core)) errors.push("adapters/core-rules.md: missing BEGIN/END core rules markers");
for (const a of ["adapters/AGENTS.md", "adapters/copilot-instructions.md", "adapters/cursor/outsystems-ai-mentor.mdc"]) {
  if (!existsSync(join(ROOT, a))) { errors.push(`${a}: missing`); continue; }
  const b = block(read(a).replace(/\r\n/g, "\n"));
  if (!b) errors.push(`${a}: missing BEGIN/END core rules markers`);
  else if (b !== block(core)) errors.push(`${a}: core rules block differs from adapters/core-rules.md`);
}

// 4b. Files a public repository needs
for (const f of ["README.md", "LICENSE", "CHANGELOG.md", "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "SECURITY.md",
  ".gitignore", ".gitattributes", "package.json", ".github/workflows/ci.yml", ".github/workflows/release.yml",
  ".github/PULL_REQUEST_TEMPLATE.md", ".github/ISSUE_TEMPLATE/config.yml"]) {
  if (!existsSync(join(ROOT, f))) errors.push(`${f}: missing (needed for public release)`);
}
if (existsSync(join(ROOT, ".gitignore")) && !/^\.private-names$/m.test(read(".gitignore"))) errors.push(".gitignore: must ignore .private-names");
if (existsSync(join(ROOT, "README.md"))) {
  const readme = read("README.md");
  for (const m of readme.matchAll(/\]\((?!https?:|#|mailto:)([^)#\s]+)/g)) {
    if (!existsSync(join(ROOT, m[1]))) errors.push(`README.md: broken relative link ${m[1]}`);
  }
}

// 5. Evals parse
if (existsSync(join(ROOT, "evals/evals.json"))) {
  try {
    const ev = JSON.parse(read("evals/evals.json"));
    if (!Array.isArray(ev.evals) || !ev.evals.length) errors.push("evals/evals.json: no evals");
  } catch (e) { errors.push(`evals/evals.json: ${e.message}`); }
}

// 6. Privacy / secret hygiene
const secretRes = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  [/\b(?:api[_-]?key|secret|password|token)\s*[:=]\s*["']?[A-Za-z0-9+/_-]{16,}/i, "credential-like assignment"],
  [/\b[A-Za-z0-9._%+-]+@(?!example\.(?:com|org)\b|noreply\b|users\.noreply\.github\.com\b)[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, "e-mail address"],
  [/\b(?:\d{1,3}\.){3}\d{1,3}\b/, "IP address"],
  [/[A-Za-z]:\\Users\\|\/c\/Users\/|\/home\/[a-z]/, "local user path"],
];
let banned = [];
if (existsSync(join(ROOT, ".private-names"))) banned = read(".private-names").split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith("#"));
if (process.env.PRIVATE_NAMES) banned.push(...process.env.PRIVATE_NAMES.split(",").map((s) => s.trim()).filter(Boolean));
const bannedRes = banned.map((n) => [new RegExp(`(?<![A-Za-z0-9])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9])`, "i"), `private name "${n}"`]);
for (const f of textFiles) {
  if (f === "scripts/check_skill.mjs") continue;
  read(f).split("\n").forEach((line, i) => {
    for (const [re, what] of [...secretRes, ...bannedRes]) {
      if (!re.test(line)) continue;
      if (what === "IP address" && /\b127\.0\.0\.1\b|\b0\.0\.0\.0\b/.test(line)) continue;
      errors.push(`${f}:${i + 1}: possible ${what}`);
    }
  });
}

for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error:   ${e}`);
console.log(errors.length ? `FAILED: ${errors.length} error(s)` : `OK: ${files.length} files checked, ${defined.length} rule IDs, ${lessons.length} lessons, ${banned.length} private names screened`);
process.exit(errors.length ? 1 : 0);
