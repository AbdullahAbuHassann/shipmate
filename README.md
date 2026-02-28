# shipmate

Turn GitHub issues into pull requests. Your team describes what they want in plain English, Claude handles everything from clarification to code to testing.

---

## The full flow

### 1. Open an issue

Use the **Feature Request** or **Bug Report** form. Fill it in plain English. `@claude` is automatically included — no need to type it.

Claude responds within about a minute with clarifying questions.

### 2. Answer Claude's questions

Reply in the issue thread. Plain English. Claude is trying to fill in details that would affect how it builds the feature. Once it has enough, it'll say so.

### 3. `@claude plan`

Comment `@claude plan` on the issue. Claude will read the relevant spec in `.spec-workflow/specs/` first, then:
- Read the codebase
- Write an implementation plan
- Post a plain-English summary of what it's going to build and which files it'll touch

Review the plan. Ask for changes if anything looks wrong. When you're happy, move on.

### 4. `@claude implement`

Comment `@claude implement`. Claude will:
- Write the code
- Run tests and linting
- Open a pull request

As soon as the PR opens, two automated reviews run in parallel:
- **Code review** — logic errors, code quality, adherence to project standards
- **Security review** — OWASP Top 10, hardcoded secrets, injection vulnerabilities

If either review flags something, you can reply to the inline comment with `@claude fix this` and Claude will push a correction to the same branch.

### 5. Get the preview URL

Railway deploys every PR automatically. Once the PR opens, Railway posts a preview URL as a comment on the PR. This usually takes 1–2 minutes.

### 6. `@claude test <url>`

Comment `@claude test https://your-app-pr-42.up.railway.app` on the PR or issue. Claude navigates the preview URL using a real browser — clicking, filling forms, taking screenshots — and posts a report of what it found.

### 7. Review and merge

Look at the PR. If everything looks good, merge it.

---

## Setup

About 10 minutes. Full instructions in [SETUP.md](SETUP.md).

1. Click **"Use this template"** to create your own copy of this repo
2. Add your `CLAUDE_CODE_OAUTH_TOKEN` secret to GitHub
3. Edit `.claude/CLAUDE.md` to describe your project's stack and conventions
4. Add your dependency install commands to `.github/workflows/claude-issues.yml`
5. Connect Railway for PR preview deployments

---

## What's included

```
├── .github/
│   ├── workflows/
│   │   ├── claude-issues.yml        # Handles all @claude commands
│   │   ├── ci.yml                   # Runs lint + tests on every PR
│   │   ├── pr-review.yml            # Automatic code review on every PR
│   │   └── pr-security-review.yml   # Automatic security review on every PR
│   └── ISSUE_TEMPLATE/
│       ├── feature_request.yml      # Feature request form (auto-triggers @claude)
│       └── bug_report.yml           # Bug report form (auto-triggers @claude)
├── .claude/
│   ├── CLAUDE.md                    # Your project conventions — customise this
│   └── commands/                    # Slash commands used internally by Claude
├── .spec-workflow/
│   └── specs/                       # One spec per feature — the source of truth
│       ├── todo-feature.md          # What the todo feature does (replace with yours)
│       └── ui-and-design.md         # Visual decisions: colours, layout, components
├── .agents/
│   └── plans/                       # Plan files are saved and committed here
├── public/                          # Example app (plain HTML/CSS/JS todo list)
├── server.js                        # Example app (Node.js + Express)
├── tests/                           # Example app tests (Jest)
├── CLAUDE.md                        # Issue handling instructions for Claude
└── SETUP.md                         # Full setup guide
```

The `public/`, `server.js`, and `tests/` folders are an example Node.js to-do app. Replace them with your own project. Keep everything in `.github/`, `.claude/`, and `.agents/`.

---

## Requirements

- **Claude Code OAuth token** — from [claude.ai](https://claude.ai) (requires Claude Pro or Team)
- **Railway account** — free tier works for preview deployments
- **GitHub repository** — public or private, any plan with Actions enabled
