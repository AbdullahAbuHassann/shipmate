# GitHub Issue Handling Instructions

When working on GitHub issues for this repository, follow this protocol.

---

## New Issues (no prior comments from you)

First: run /prime to understand the codebase. Then read the issue carefully and in full.

Only after doing both, ask 3-6 numbered clarifying questions. Your goal is to fill in gaps that are genuinely missing from the issue — not to restate or re-ask things already there.

Rules:
- Read the issue thoroughly before forming any question. If the answer is already in the issue, do not ask it.
- Only ask about things that are truly ambiguous or missing and would change how you build it.
- Write in plain language — the user is non-technical.
- Think about edge cases the user may not have considered, and ask about those.

Do NOT implement anything. Just ask questions.

## Follow-up Comments (answering your questions)

Answer helpfully. If you have enough information, summarise what you know and tell the user they can say "@claude plan" when ready.

## Planning (user says "@claude plan")

1. Run /prime to load project context
2. Run /plan-feature with a full summary of the issue and all follow-up discussion
3. Save the plan as `.agents/plans/issue-{number}.md` (use the actual issue number)
4. Push the plan file to main so the implement session can find it:
   ```bash
   git fetch origin main
   git checkout main
   git pull origin main
   git add .agents/plans/issue-{number}.md
   git commit -m "chore: save plan for issue #{number} [skip ci]"
   git push origin main
   ```
5. Post a plain-English comment summarising what will be built, the key decisions made, and which files will change
6. Tell the user to reply "@claude implement" when they are happy with the plan

Do NOT write any code.

## Implementation (user says "@claude implement")

The plan has already been loaded into your context. Do not re-read the thread.

1. Run /execute with the plan
2. Run /code-review and fix any critical issues
3. Create a PR that references the issue with a rich description that includes:
   - Use `gh pr create` to open the PR
4. After creating the PR, post a comment back to the issue using `gh issue comment <issue-number> --body "..."` summarising what was built and linking to the PR
   - Summary of what was built
   - Files changed and why
   - Tests written and their results
   - How to verify the feature in the preview environment (if Railway is configured)

## Testing (user says "@claude test")

The user will include the Railway preview URL in their comment (e.g. `@claude test https://my-app-pr-42.up.railway.app`).

1. Extract the preview URL from the comment
2. Use Playwright MCP to navigate to the URL and verify the feature works:
   - Navigate to the relevant page(s)
   - Interact with the UI as a user would
   - Take screenshots of key states
   - Check for errors in the console or UI
3. Post a PR comment reporting findings:
   - What was tested
   - What worked as expected
   - Any issues found
   - Screenshots if relevant

## Pull Request Review Comments

When tagged on a PR comment (e.g. from CodeRabbit or a human reviewer):

1. Read the comment and understand the requested change
2. For non-trivial changes, run /prime first to load project context
3. Make the requested changes
4. Commit with a clear message referencing the feedback
5. Push to the same branch so the PR is updated

Do NOT create a new branch or a new PR. Always push to the existing PR branch.

When pushing a feature branch during implementation, use `git push --force-with-lease origin HEAD` to handle cases where a previous failed run already pushed commits to the same branch.

## Infrastructure

Both frontend and backend are hosted on Railway in the same project. PR environments are enabled — every PR automatically gets a preview deployment of both services. Non-technical users test via the preview URLs posted on the PR.
