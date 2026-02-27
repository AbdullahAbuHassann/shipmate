# Setup Guide

Follow these steps to get `ai-contributor` working in your repository.

---

## Step 1: Create your repository from this template

1. Click **"Use this template"** at the top of this repository on GitHub
2. Choose **"Create a new repository"**
3. Name it, set visibility, and click **"Create repository"**

---

## Step 2: Get your Claude Code OAuth token

1. Go to [claude.ai](https://claude.ai) and sign in (requires Claude Pro or Team)
2. Open Claude Code in your terminal and run:
   ```bash
   claude auth token
   ```
3. Copy the token that is printed

---

## Step 3: Add the secret to GitHub

1. In your new repository, go to **Settings > Secrets and variables > Actions**
2. Click **"New repository secret"**
3. Name: `CLAUDE_CODE_OAUTH_TOKEN`
4. Value: paste your token
5. Click **"Add secret"**

---

## Step 4: Customise `.claude/CLAUDE.md` for your stack

This file teaches Claude your project's conventions. Open it and fill in each `[TODO]` section:

- **Tech Stack** — your languages, frameworks, and key libraries
- **Project Structure** — directory layout (a tree diagram is ideal)
- **Commands** — your install, dev, test, and lint commands
- **Architecture Patterns** — patterns Claude must follow (e.g. repository pattern, error format)
- **Code Style** — naming conventions, file size limits, type hint requirements
- **Testing Standards** — test pyramid, fixtures, mock patterns

The more specific you are, the better Claude's output will be. If Claude writes code that doesn't match your patterns, update this file.

---

## Step 5: Add your dependency setup to the workflow

Open `.github/workflows/claude-issues.yml` and find the comment block that starts with:

```yaml
# ─────────────────────────────────────────────────────────────────────
# TODO: Add your project's dependency setup here.
```

Replace the comment examples with your actual setup steps. For example:

**Node.js:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
- run: npm ci
```

**Python with uv:**
```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
- run: pip install uv && uv sync
```

**Go:**
```yaml
- uses: actions/setup-go@v5
  with:
    go-version: "1.22"
```

Do the same for `.github/workflows/ci.yml`.

---

## Step 6: Set up Railway (optional but recommended)

Railway provides automatic preview deployments for every PR, so non-technical users can test features without touching code.

### Create a Railway project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"** and select your repository
4. Railway will detect your stack and configure the initial deployment

### Enable PR environments

1. In your Railway project, go to **Settings**
2. Find **"PR Deployments"** and enable it
3. Every PR will now get its own deployed environment

### Connect your services

If you have multiple services (e.g. backend + frontend + database):

1. Add each service to the Railway project
2. Set environment variables for each service
3. Railway will replicate the full stack for each PR environment

### Get the preview URL format

Railway posts the preview URL as a PR comment automatically. The format is typically:
```
https://your-service-pr-{number}.up.railway.app
```

Copy this URL and use it with `@claude test <url>` to trigger Playwright verification.

---

## Step 7: Test it

1. Go to the **Issues** tab in your repository
2. Click **"New issue"**
3. Choose **"Feature Request"** or **"Bug Report"** from the templates
4. Fill in the form and submit

Claude will respond in the issue thread within a minute or two. If it doesn't:
- Check **Actions** to see if the workflow ran
- Verify the `CLAUDE_CODE_OAUTH_TOKEN` secret is set correctly
- Confirm the issue has the `bug` or `enhancement` label (the templates apply these automatically)

---

## Troubleshooting

### Claude doesn't respond to my issue

- Check that the issue has a `bug` or `enhancement` label
- Check the Actions tab for workflow run errors
- Verify the `CLAUDE_CODE_OAUTH_TOKEN` secret is correct and not expired

### Claude says "No plan file found"

- The user needs to run `@claude plan` before `@claude implement`
- Check that the plan file was pushed to main (look in `.agents/plans/`)
- Ensure `[skip ci]` in the plan commit message isn't causing issues

### The workflow runs but Claude posts nothing

- Check the workflow logs in the Actions tab for the step "Run Claude"
- Verify your token has the correct permissions
- Try re-running the failed workflow job

### `@claude test` doesn't browse the preview URL

- Confirm the Playwright browser install step ran (it only runs when `@claude test` is in the comment)
- Verify the URL is publicly accessible
- Check that the MCP config in the workflow YAML is valid JSON

---

## Customising the Issue Templates

The issue templates are in `.github/ISSUE_TEMPLATE/`. They are YAML files that GitHub renders as forms.

To add a new template:
1. Create a new `.yml` file in that directory
2. Follow the [GitHub issue template syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema)
3. Add `@claude` in the body so the workflow triggers automatically

To change which labels trigger Claude, edit the `if:` condition in `.github/workflows/claude-issues.yml`:

```yaml
(contains(github.event.issue.labels.*.name, 'bug') || contains(github.event.issue.labels.*.name, 'enhancement'))
```
