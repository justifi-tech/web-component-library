# Code Review System Organization

Simple guide to understanding the code review system.

## Quick Reference

| Command | Where | What it does |
|---------|-------|--------------|
| `/review 1234` | CLI | Shows concise review in terminal (does NOT post to GitHub) |
| `/pr-review 1234` | CLI | Posts concise review to GitHub PR (same format as above) |

**Both commands produce identical output.** The only difference is where it goes.

## The Three Files

```
.claude/
├── agents/code-review/AGENT.md    ← The brain (produces the review text)
├── skills/review/SKILL.md         ← CLI command (shows review locally)
└── skills/pr-review/SKILL.md      ← GitHub command (posts review)
```

### 1. `agents/code-review/AGENT.md` - The Reviewer

**What it does:**
- Analyzes code diffs and finds issues
- Produces ultra-concise review text
- Used by BOTH skills below

**When you edit this:**
- Changes affect both `/review` AND `/pr-review` output
- This is your single source of truth for review format and rules

### 2. `skills/review/SKILL.md` - Quick CLI Review

**What it does:**
- Fetches PR data with `gh pr view` and `gh pr diff`
- Invokes the code-review agent
- Shows the output in your CLI

**When to use:**
- "I want to quickly check a PR before commenting"
- "Let me see what Claude thinks without posting anything"

### 3. `skills/pr-review/SKILL.md` - Post to GitHub

**What it does:**
- Fetches PR data (same as review skill)
- Counts meaningful lines (source/test/generated breakdown)
- Invokes the code-review agent
- **Posts the output to GitHub as an official review**
- Uses GitHub review actions: `--approve`, `--request-changes`, or `--comment`

**When to use:**
- "I want Claude to officially review this PR on GitHub"
- Automated workflows (GitHub Actions)

**Extra features:**
- Counts lines and enforces 250 source line limit
- Maps verdicts to GitHub review actions
- Oversized PRs always get `--comment` (never auto-approved)

## The Output Format

Both skills produce this **concise** format:

```markdown
**Changes Approved ✓**

Brief explanation of verdict.

## Issues

- **Critical** - Issue title (file.ts:123) - How to fix
- **Suggestion** - Another issue (file.ts:456) - Brief note

## Test Plan

- [ ] Test item 1
- [ ] Test item 2

---
*Automated review • [View guide](link)*
```

**Key principles:**
- One line per issue
- No "Positive Observations" section
- No elaborate split strategies for oversized PRs
- Total review should be < 50 lines for most PRs

## Customizing

**To change review format/rules:**
→ Edit `agents/code-review/AGENT.md`

**To change when reviews get posted to GitHub:**
→ Edit `skills/pr-review/SKILL.md`

**To add more CLI convenience features:**
→ Edit `skills/review/SKILL.md`

## Why This Organization?

**Before (confusing):**
- Multiple files with duplicate logic
- Unclear which command does what
- Different output formats

**After (clear):**
- One agent = one format = consistency
- Two skills = two delivery methods (CLI vs GitHub)
- Edit one file to change review behavior everywhere
