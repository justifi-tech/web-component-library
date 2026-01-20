# Claude Code - Code Review System

This directory contains the custom agents and skills for automated code review in the JustiFi Web Component Library.

## Architecture

The code review system uses a **separation of concerns** approach:

### 🧠 `code-review` Agent (`.claude/agents/code-review/`)
**Pure code analysis** - GitHub-agnostic
- Input: Git diff content (from any source)
- Output: Structured review findings
- Checks: Stencil patterns, TypeScript, testing, security, performance, accessibility
- Can be used with uncommitted changes, branches, or PRs

### 🔗 `pr-review` Skill (`.claude/skills/pr-review/`)
**GitHub PR orchestration** - Handles GitHub operations
- Fetches PR data using `gh pr view` and `gh pr diff`
- Invokes `code-review` agent with the diff
- Posts results using `gh pr comment`
- Only for existing GitHub PRs

## Local Usage

### Review Uncommitted Changes (No PR needed)

```bash
# In Claude Code CLI, just ask:
"Review my uncommitted changes"
"Analyze the changes I made to the checkout component"
```

Claude will:
1. Run `git diff` to get your changes
2. Invoke the `code-review` agent with the diff
3. Show you the review results

### Review Branch vs Main (No PR needed)

```bash
"Review the changes in this branch compared to main"
"What issues are in my feature branch?"
```

Claude will:
1. Run `git diff main` (or appropriate base branch)
2. Invoke the `code-review` agent with the diff
3. Show you the review results

### Review Existing PR

```bash
"Review PR #123"
"Use pr-review skill for PR #456"
```

Claude will:
1. Fetch PR data using `gh pr view #123`
2. Fetch PR diff using `gh pr diff #123`
3. Invoke the `code-review` agent with the diff
4. Post the review as a comment on the PR

## GitHub Actions Usage

The workflow at `.github/workflows/claude-code-review.yml` automatically runs on every PR:

1. Workflow triggers on `pull_request` events (opened, synchronized)
2. Claude is invoked with the PR number
3. The `pr-review` skill handles:
   - Fetching PR data
   - Calling `code-review` agent
   - Posting review comment

## What Gets Reviewed

The `code-review` agent checks for:

### Stencil Component Patterns
- Proper decorator usage (@Component, @Prop, @State, @Event, @Watch)
- Correct prop types and validation
- Lifecycle method usage
- Shadow DOM vs light DOM

### Testing
- Tests exist in `src/components/{component}/test/*.spec.tsx`
- Uses `newSpecPage` from `@stencil/core/testing`
- Snapshot tests for rendering
- Coverage of new functionality
- TZ=utc for date consistency

### TypeScript
- Proper type definitions (no unnecessary `any`)
- Interface definitions
- Type safety in props and events

### Architecture
- Correct directory structure (components/ vs ui-components/)
- Reusable form controls in ui-components/form/
- Business logic in actions/
- API calls in api/ layer
- State management with @stencil/store

### Styling
- Bootstrap 5 class usage
- SCSS patterns
- No inline styles (unless necessary)
- Responsive design

### Security
- No hardcoded secrets
- Input validation (Yup schemas)
- XSS prevention
- SQL injection prevention
- Secure financial data handling

### Performance
- No unnecessary re-renders
- Efficient @Watch usage
- Proper memoization
- Efficient list handling

### Documentation
- JSDoc comments
- README updates
- Changeset created (`pnpm changeset`)

### Common Issues
- Unused imports/variables
- Console.log statements
- Incorrect Bootstrap classes
- Missing error handling
- Accessibility issues (ARIA, keyboard nav)
- Missing prop validations

## Testing the System Locally

Want to test before pushing? Create some changes and ask Claude:

```bash
# Make some changes
echo "// test change" >> src/components/some-component.tsx

# Ask Claude to review
"Review my changes"
```

You'll get the same quality review locally that you'd get in CI!

## Customizing the Review

### Modify Review Criteria
Edit `.claude/agents/code-review/AGENT.md` to add or change review checks.

### Modify PR Workflow
Edit `.claude/skills/pr-review/SKILL.md` to change how PRs are processed.

### Update GitHub Workflow
Edit `.github/workflows/claude-code-review.yml` to:
- Change when reviews run (file paths, PR authors, etc.)
- Add additional permissions
- Modify the prompt

## Benefits of This Architecture

✅ **Test Locally First** - Review changes before creating a PR
✅ **Consistent Reviews** - Same agent runs locally and in CI
✅ **Flexible** - Works with uncommitted changes, branches, or PRs
✅ **Maintainable** - Separation of concerns makes updates easy
✅ **Reusable** - The core review logic is GitHub-agnostic

## Troubleshooting

**"gh command not found"** - Install GitHub CLI: `brew install gh`

**"Permission denied"** - Authenticate: `gh auth login`

**"PR not found"** - Make sure you're in the correct repo and PR number is valid

**"Agent failed"** - Check that `.claude/agents/code-review/AGENT.md` exists and is valid

**"Skill not found"** - Check that `.claude/skills/pr-review/SKILL.md` exists and is valid
