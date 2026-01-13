---
name: review
description: Quick PR code review with streamlined, concise feedback
allowed-tools: Bash, Task, Read
---

# Review Skill

Quick PR code review skill that provides streamlined, verdict-first feedback.

## How to Use

```
/review <PR_NUMBER or PR_URL>
/review 1306
/review https://github.com/justifi-tech/web-component-library/pull/1306
```

If no PR number is provided, shows list of open PRs.

## Instructions

### Step 1: Extract PR Number

- Look for PR number in args (supports "#123", "123", or full GitHub URLs)
- If URL provided, extract the PR number from it
- If no PR number found, run `gh pr list` and ask user which PR to review

### Step 2: Fetch PR Data

Fetch PR information and diff:

```bash
gh pr view <PR_NUMBER>
gh pr diff <PR_NUMBER>
```

### Step 3: Invoke Code Review Agent

Use the Task tool to invoke the code-review agent. Read the agent instructions first:

```
Read: .claude/agents/code-review/AGENT.md
```

Then invoke with `general-purpose` subagent:

```
You are performing a code review following the guidelines in .claude/agents/code-review/AGENT.md.

[Include key review criteria from agent instructions]

Review the following code changes:

PR: #<NUMBER> - <TITLE>
Author: <AUTHOR>
Branch: <HEAD> -> <BASE>

Description:
<BODY>

Diff:
<DIFF_CONTENT>

CRITICAL: Start your response with exactly one of these verdict markers:
<!-- VERDICT: APPROVED -->
<!-- VERDICT: NOT_APPROVED -->
<!-- VERDICT: COMMENT -->

Follow the code-review agent format:
- Start with verdict (bold with emoji)
- 1-2 sentence quality assessment
- Flat issues list with (critical) or (suggestion) labels
- Include Test Plan section
- Be concise and direct
```

### Step 4: Present Results

Display the review output to the user. The code-review agent will format it according to the new streamlined format:

- Verdict first with emoji indicator
- Consolidated quality assessment in verdict explanation
- Flat issues list with clear priority labels
- Test plan with specific verification steps

## Notes

- This skill is for CLI use only (not GitHub Actions)
- Provides immediate feedback without posting to GitHub
- Uses the same code-review agent as pr-review skill for consistency
- Format optimized for readability and reduced noise
