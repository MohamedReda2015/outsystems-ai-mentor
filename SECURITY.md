# Security policy

This repository contains guidance (Markdown) and small zero-dependency Node.js scripts. It has no runtime service.

## Reporting
- **Confidential data committed by mistake** (client names, real requirements, personal data, internal URLs, credentials): report it privately through a GitHub **Security Advisory** (Security → Report a vulnerability). Don't open a public issue that repeats the data.
- **A rule that would lead to an insecure delivery** (for example advice that lets an agent publish or deploy without approval, type secrets, or skip server-side checks): open a Security Advisory or an issue labelled `security`, with the rule ID and the source.
- **A vulnerability in the scripts** (`scripts/*.mjs`): report it privately through a Security Advisory.

The scripts only read local JSON/Markdown files and print a report. They make no network calls and run nothing external.

## Using the skill safely
- The skill tells agents to keep real personal data and secrets out of prompts and module defaults (`MWS-04`), to write only to Development, and to ask before every publish, deploy or data-changing step (`MWG-04`).
- The Service Studio MCP runs agent-written C# with the developer's privileges: use it only on modules you own.
- Keep real requirements and workflow-state files in your private project, not in this repository.

## Scope
OutSystems platform vulnerabilities are **out of scope**. Report them to OutSystems through their official channels.
