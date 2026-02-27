# Setup Guide

Follow these steps to get shipmate working in your repository.

---

## Step 1: Install the Claude GitHub App

1. Go to [github.com/apps/claude](https://github.com/apps/claude)
2. Click **"Install"**
3. Select the repository you want to use it on
4. Confirm the permissions

This is required for the workflow to post comments and open PRs on Claude's behalf.

---

## Step 2: Create your repository from this template

1. Click **"Use this template"** at the top of this repository on GitHub
2. Choose **"Create a new repository"**
3. Name it, set visibility, and click **"Create repository"**

---

## Step 3: Get your Claude Code OAuth token

1. Go to [claude.ai](https://claude.ai) and sign in (requires Claude Pro or Team)
2. Open Claude Code in your terminal and run:
   ```bash
   claude auth token
   ```
3. Copy the token that is printed

---

## Step 4: Add the secret to GitHub

1. In your new repository, go to **Settings > Secrets and variables > Actions**
2. Click **"New repository secret"**
3. Name: `CLAUDE_CODE_OAUTH_TOKEN`
4. Value: paste your token
5. Click **"Add secret"**

---

## Step 5: Customise `.claude/CLAUDE.md` for your stack

This file teaches Claude your project's conventions. Fill in:

- **Tech Stack** — your languages, frameworks, and key libraries
- **Project Structure** — directory layout (a tree diagram is ideal)
- **Commands** — your install, dev, test, and lint commands
- **Architecture Patterns** — patterns Claude must follow
- **Testing Standards** — test framework, file locations, patterns

The more specific you are, the better Claude's output will be.

---

## Step 6: Add your dependency setup to the workflow

Open `.github/workflows/claude-issues.yml` and find the comment block marked `TODO`. Replace it with your actual setup steps.

**Node.js:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
- run: npm ci
```

**Python:**
```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
- run: pip install uv && uv sync
```

Do the same for `.github/workflows/ci.yml`.

---

## Step 7: Set up Railway

Railway provides automatic preview deployments for every PR.

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"** → select your repo
3. Railway detects your stack and deploys automatically
4. Go to your service **Settings** → enable **"PR Deployments"**

Every PR now gets its own preview URL. Railway posts it as a comment on the PR automatically. Copy that URL and use it with `@claude test <url>`.

---

## Step 8: Test it

Open a new issue, write what you want in plain English, and include `@claude` anywhere in the body. Claude will respond within a minute or two.

If it doesn't respond:
- Check the **Actions** tab to see if the workflow ran
- Verify the `CLAUDE_CODE_OAUTH_TOKEN` secret is set correctly
- Confirm the Claude GitHub App is installed on the repo (Step 1)

---

## Troubleshooting

### Claude doesn't respond to my issue

- Check the Actions tab for workflow run errors
- Verify the token is correct and not expired
- Confirm the Claude GitHub App is installed

### Claude says "No plan file found"

- Run `@claude plan` before `@claude implement`
- Check that the plan file was pushed to main (look in `.agents/plans/`)

### The workflow runs but Claude posts nothing

- Check the workflow logs in Actions for the "Run Claude" step
- Try re-running the failed workflow job

### `@claude test` doesn't browse the preview URL

- Confirm the Playwright browser install step ran (only runs when comment contains `@claude test`)
- Verify the Railway URL is publicly accessible
