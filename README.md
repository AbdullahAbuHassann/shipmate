# shipmate

**Your non-technical team ships code. You review and merge.**

A GitHub Actions workflow that turns plain-English GitHub issues into pull requests with clarification, planning, implementation, and live preview testing handled by Claude.

---

## The Problem

Most teams have non-technical members who know exactly what they want but can't turn that into a PR. The gap between "here's the issue" and "here's the code" costs time, loses context, and leaves good ideas on the table.

---

## How It Works

```
Non-technical user                    Claude                         You (reviewer)
       |                                 |                                 |
       | Opens issue with form           |                                 |
       |-------------------------------->|                                 |
       |                                 | Asks clarifying questions       |
       |<--------------------------------|                                 |
       | Answers questions               |                                 |
       |-------------------------------->|                                 |
       |                                 |                                 |
       | "@claude plan"                  |                                 |
       |-------------------------------->|                                 |
       |                                 | Explores codebase               |
       |                                 | Writes implementation plan      |
       |                                 | Posts plain-English summary     |
       |<--------------------------------|                                 |
       |                                 |                                 |
       | "@claude implement"             |                                 |
       |-------------------------------->|                                 |
       |                                 | Implements plan                 |
       |                                 | Runs tests & linting            |
       |                                 | Opens PR ------------------->   |
       |                                 |                                 | Reviews PR
       |                                 |                                 | Checks preview
       |                                 |                                 | Merges
```

### The full flow, step by step

1. **Open an issue** using the bug report or feature request form
2. **Claude asks questions** — plain English, no jargon
3. **Answer** in the issue thread
4. **`@claude plan`** — Claude writes an implementation plan and posts a summary
5. **Review the plan** — approve or ask for changes
6. **`@claude implement`** — Claude implements, tests, and opens a PR
7. **Preview** — Railway automatically deploys the PR to a preview URL
8. **`@claude test <preview-url>`** — Claude uses Playwright MCP to navigate the preview URL and verify the feature works
9. **Review the PR** — Claude has done the work, you decide whether to merge

---

## What Your Team Sees

Just GitHub issues and a preview URL. No terminals, no code, no PRs to open. They describe what they want, answer questions, and watch it appear in a preview environment.

---

## What You See as Reviewer

A rich PR description with:
- Summary of what was built and why
- List of files changed and what each one does
- Test results (lint + unit tests passed)
- Link to the plan file (`.agents/plans/issue-{number}.md`)
- Preview URL to test the feature live

---

## Features

- **Plan/implement split** — Claude plans first and waits for approval before writing a single line of code
- **Structured issue templates** — non-technical users fill a form; `@claude` is auto-applied
- **Playwright MCP verification** — Claude navigates the live preview URL like a user would
- **Railway PR environments** — every PR gets its own deployed preview automatically
- **Rich PR descriptions** — summary, files changed, tests run, preview link
- **Works on any stack** — Node, Python, Go, Ruby, whatever you use
- **Context-aware sessions** — the implement session reads the plan file, not the full issue thread

---

## Quick Setup

### 1. Use this template

Click **"Use this template"** on GitHub to create your own copy.

### 2. Add your secret

Go to `Settings > Secrets and variables > Actions` and add:

```
CLAUDE_CODE_OAUTH_TOKEN = <your token>
```

See [SETUP.md](SETUP.md) for how to get your token.

### 3. Customise for your stack

Edit `.claude/CLAUDE.md` — this is where Claude learns your conventions, commands, and architecture. The file has `[TODO]` markers showing exactly what to fill in.

Then add your dependency setup steps to `.github/workflows/claude-issues.yml` — there's a clearly marked comment block showing where.

---

## Requirements

- **Claude Code OAuth token** — from [claude.ai](https://claude.ai) (requires Claude Pro or Team)
- **Railway account** — for PR preview environments (optional but recommended)
- A GitHub repository on a paid plan (Actions minutes required)

---

## The `@claude test` Command

After a PR is created, Railway deploys it automatically. Once the preview is live:

```
@claude test https://your-app-pr-42.up.railway.app
```

Claude navigates the preview URL using Playwright MCP — clicking, filling forms, taking screenshots — and reports back what it found. This is genuine AI-driven verification, not pre-written Playwright scripts.

---

## Repository Structure

```
ai-contributor/
├── .github/
│   ├── workflows/
│   │   ├── claude-issues.yml    # Main Claude workflow
│   │   └── ci.yml               # PR CI (lint + tests)
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.yml       # Structured bug form
│       └── feature_request.yml  # Structured feature form
├── .claude/
│   ├── CLAUDE.md                # Your project conventions (customise this)
│   └── commands/                # Slash commands used by Claude
│       ├── prime.md
│       ├── plan-feature.md
│       ├── execute.md
│       ├── code-review.md
│       ├── commit.md
│       └── issue_fix_prompt.md
├── .agents/
│   ├── plans/                   # Plan files saved here (committed to main)
│   └── code-reviews/            # Code review outputs
├── CLAUDE.md                    # Issue handling protocol
├── README.md                    # This file
└── SETUP.md                     # Step-by-step setup guide
```

---

## Full Setup Guide

See [SETUP.md](SETUP.md) for step-by-step instructions including Railway configuration.
