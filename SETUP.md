# Setup

Follow these steps in order. Takes about 10 minutes.

---

## 1. Install the Claude GitHub App

Go to [github.com/apps/claude](https://github.com/apps/claude), click **Install**, and select your repository.

This is what allows Claude to post comments and open pull requests on your repo.

---

## 2. Create your repository from this template

On this repository's GitHub page, click **"Use this template"** → **"Create a new repository"**.

Give it a name, choose public or private, and create it. From here on, work in your new repo.

---

## 3. Get your Claude Code OAuth token

You need a Claude Pro or Team account at [claude.ai](https://claude.ai).

Open a terminal and run:

```bash
claude setup-token
```

Copy the token it prints.

---

## 4. Add the token to GitHub

In your new repository, go to **Settings → Secrets and variables → Actions → New repository secret**.

- Name: `CLAUDE_CODE_OAUTH_TOKEN`
- Value: paste your token

---

## 5. Tell Claude about your project

Open `.claude/CLAUDE.md`. This is where Claude learns your stack, folder structure, and conventions. Replace the placeholder content with your own:

- **Tech Stack** — your languages and frameworks
- **Project Structure** — a short directory tree
- **Commands** — how to install, run, test, and lint your project
- **Architecture Patterns** — anything Claude must know before touching the code
- **Code Style** — naming conventions, formatting rules

The more specific you are here, the better Claude's output will be. If you're starting fresh and have nothing to fill in yet, leave the example content in place — it matches the todo app that's already in the repo.

---

## 6. Set up spec-workflow MCP and write your specs

Specs are the source of truth for every feature. Non-technical users open issues to request enhancements or report bugs — Claude reads the relevant spec before planning any work to make sure everything stays within what was designed.

**Install spec-workflow MCP**

It's already configured in `.mcp.json`. Open a terminal in your project and run:

```bash
npx -y @pimzino/spec-workflow-mcp@latest --dashboard
```

This starts a local dashboard at `http://localhost:5000`. You can use it to create and manage specs visually, or just write them as markdown files directly in `.spec-workflow/specs/`.

**Write a spec for each feature**

Two starter specs are already in `.spec-workflow/specs/`:
- `todo-feature.md` — what the todo functionality does and doesn't do
- `ui-and-design.md` — all visual decisions: colours, layout, components, interactions

Replace these with specs for your own app. A spec answers:
- What does this feature do?
- What does it explicitly NOT do?
- What are the acceptance criteria?

**Commit your specs to the repo.** Claude in GitHub Actions reads them from the repo during planning.

**The rule:** every feature has a spec. Non-technical users request enhancements on existing specced features. If a request doesn't fit any spec, Claude will say so and a developer writes or updates the spec first.

For minor visual changes (button labels, colours, wording), they fall under `ui-and-design.md`. You don't need a separate spec per button.

---

## 7. Add your dependency install commands (workflow)

Open `.github/workflows/claude-issues.yml`. Find the comment block that starts with `TODO: Add your project's dependency setup here`.

Replace the comment with your actual setup steps. For example:

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

The example todo app uses Node.js, so if you're keeping it, add the Node.js block above.

Do the same in `.github/workflows/ci.yml`.

---

## 8. Set up Railway for PR previews

Railway deploys your app automatically on every PR and posts a preview URL as a comment. This is what you pass to `@claude test`.

**Create a project:**
1. Go to [railway.app](https://railway.app) and sign in
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Railway detects Node.js (or your stack) and deploys automatically

**Enable PR deployments:**
1. Click on your service inside the project
2. Go to **Settings**
3. Find **PR Deployments** and turn it on

That's it. Every time a PR opens, Railway builds and deploys it. The URL appears as a comment on the PR within a minute or two.

---

## 9. Test the whole flow

Open a new issue in your repo. Use the **Feature Request** form and describe something small you want added to the to-do app — for example, "Add a way to filter todos by status."

Claude will respond with questions. Answer them. Then follow the flow in [README.md](README.md).

**If Claude doesn't respond:**
- Check the **Actions** tab to see if the workflow ran and whether it failed
- Verify the `CLAUDE_CODE_OAUTH_TOKEN` secret is set (Settings → Secrets)
- Confirm the Claude GitHub App is installed on this repo (Step 1)

**If Claude says "No plan file found":**
- You need to run `@claude plan` before `@claude implement`
- Check that a plan file exists in `.agents/plans/` after planning

**If `@claude test` doesn't browse the URL:**
- The comment must contain the exact text `@claude test` followed by the URL
- The Railway URL must be publicly accessible
