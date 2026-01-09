---
name: pr-review
description: Orchestrates GitHub PR review by checking size, fetching PR data, invoking code review analysis, and posting results with native GitHub review actions
allowed-tools: Bash, Task, Read
---

# PR Review Skill

This skill handles the full GitHub PR review workflow with size checking, intelligent code analysis, and native GitHub review actions.

## How to Use

**From Claude Code CLI:**
```
"Review PR #123"
"Use pr-review skill for PR #456"
```

**From GitHub Actions:**
The workflow will provide the PR number in the prompt.

## What This Skill Does

1. **Fetches PR Information** - Uses `gh pr view` and `gh pr diff`
2. **Checks PR Size** - Counts meaningful lines (excludes lock files, generated files, etc.)
3. **Performs Code Review** - Follows code-review agent guidelines using Task tool
4. **Parses Verdict** - Extracts review verdict from analysis output
5. **Posts GitHub Review** - Uses `gh pr review` with appropriate action (approve/request-changes/comment)

## Instructions

When invoked, follow these steps:

### Step 1: Extract PR Number

- Look for PR number in the task prompt (e.g., "PR #123", "PR NUMBER: 456")
- If not provided, ask the user which PR to review

### Step 2: Fetch PR Data

Run these commands in parallel:
```bash
gh pr view <PR_NUMBER> --json title,body,author,baseRefName,headRefName
gh pr diff <PR_NUMBER>
```

Handle errors gracefully:
- PR not found: Provide clear error message
- Permission issues: Explain what's needed
- API errors: Report the issue

### Step 3: Count Meaningful Lines with Categorization

Run this bash script to count and categorize lines:

```bash
PR_NUMBER=<PR_NUMBER>

# Read pattern config file
CONFIG_FILE=".claude/config/line-count-ignored-files.txt"
TEST_PATTERNS=()
GENERATED_PATTERNS=()
CURRENT_SECTION=""

# Parse config file into pattern arrays
while IFS= read -r line; do
  # Skip comments and empty lines
  [[ "$line" =~ ^#.*$ ]] && continue
  [[ -z "$line" ]] && continue

  # Track current section
  if [[ "$line" == "[TEST]" ]]; then
    CURRENT_SECTION="TEST"
    continue
  elif [[ "$line" == "[GENERATED]" ]]; then
    CURRENT_SECTION="GENERATED"
    continue
  fi

  # Add pattern to appropriate array
  if [[ "$CURRENT_SECTION" == "TEST" ]]; then
    TEST_PATTERNS+=("$line")
  elif [[ "$CURRENT_SECTION" == "GENERATED" ]]; then
    GENERATED_PATTERNS+=("$line")
  fi
done < "$CONFIG_FILE"

# Function to check if file matches any pattern in array
matches_pattern() {
  local file="$1"
  shift
  local patterns=("$@")

  for pattern in "${patterns[@]}"; do
    # Convert glob pattern to regex using placeholders to avoid conflicts
    local regex="$pattern"

    # Step 1: Replace glob patterns with placeholders
    regex="${regex//\*\*\//__DEEPDIR__}"  # **/ -> match any depth of dirs
    regex="${regex//\*\*/__ANYPATH__}"    # ** -> match anything
    regex="${regex//\*/__FILENAME__}"     # * -> match filename chars

    # Step 2: Escape regex special chars
    regex="${regex//./\\.}"
    regex="${regex//\//\\/}"

    # Step 3: Convert placeholders to actual regex
    regex="${regex//__DEEPDIR__/(.*/)?}"       # Optional path prefix
    regex="${regex//__ANYPATH__/.*}"           # Match anything
    regex="${regex//__FILENAME__/[^/]*}"       # Match non-slash chars

    # Step 4: Anchor the pattern
    regex="^${regex}$"

    if [[ "$file" =~ $regex ]]; then
      return 0
    fi
  done

  return 1
}

# Get all changed files
CHANGED_FILES=$(gh pr diff "$PR_NUMBER" --name-only)

# Check if there are any changed files
if [ -z "$CHANGED_FILES" ]; then
  echo "No files changed in this PR"
  SOURCE_LINES=0
  TEST_LINES=0
  GENERATED_LINES=0
else
  # Save diff to temp file for processing
  DIFF_FILE="/tmp/pr_diff_${PR_NUMBER}.txt"
  gh pr diff "$PR_NUMBER" > "$DIFF_FILE"

  # Initialize counters
  SOURCE_LINES=0
  TEST_LINES=0
  GENERATED_LINES=0
  SOURCE_COUNT=0
  TEST_COUNT=0
  GENERATED_COUNT=0

  # Categorize all files
  while IFS= read -r file; do
    [ -z "$file" ] && continue

    # Check against patterns
    if matches_pattern "$file" "${TEST_PATTERNS[@]}"; then
      TEST_COUNT=$((TEST_COUNT + 1))
    elif matches_pattern "$file" "${GENERATED_PATTERNS[@]}"; then
      GENERATED_COUNT=$((GENERATED_COUNT + 1))
    else
      SOURCE_COUNT=$((SOURCE_COUNT + 1))
    fi
  done <<< "$CHANGED_FILES"

  TOTAL_FILES=$((SOURCE_COUNT + TEST_COUNT + GENERATED_COUNT))

  # Count total diff lines (excluding file markers)
  TOTAL_LINES=$(grep -E "^[+-]" "$DIFF_FILE" | grep -v -E "^(---|\+\+\+)" | wc -l | tr -d ' ')

  # If all files are the same category, assign all lines to that category
  # Otherwise, distribute lines proportionally by file count (approximation)
  if [ $TOTAL_FILES -eq $SOURCE_COUNT ]; then
    SOURCE_LINES=$TOTAL_LINES
  elif [ $TOTAL_FILES -eq $TEST_COUNT ]; then
    TEST_LINES=$TOTAL_LINES
  elif [ $TOTAL_FILES -eq $GENERATED_COUNT ]; then
    GENERATED_LINES=$TOTAL_LINES
  else
    # Mixed categories: distribute proportionally (approximation)
    if [ $SOURCE_COUNT -gt 0 ]; then
      SOURCE_LINES=$((TOTAL_LINES * SOURCE_COUNT / TOTAL_FILES))
    fi
    if [ $TEST_COUNT -gt 0 ]; then
      TEST_LINES=$((TOTAL_LINES * TEST_COUNT / TOTAL_FILES))
    fi
    if [ $GENERATED_COUNT -gt 0 ]; then
      GENERATED_LINES=$((TOTAL_LINES * GENERATED_COUNT / TOTAL_FILES))
    fi
  fi

  # Cleanup
  rm -f "$DIFF_FILE"
fi

echo "Categorized line counts:"
echo "  Source code: $SOURCE_LINES lines"
echo "  Test code: $TEST_LINES lines"
echo "  Generated files: $GENERATED_LINES lines (excluded)"
```

Store the SOURCE_LINES, TEST_LINES, and GENERATED_LINES values for use in subsequent steps.

**Note**: Line counts per category are approximated when PRs contain mixed file types. The categorization is accurate for file types, and line distribution is proportional to file count.

If counting fails, proceed with review anyway (don't let it block).

**Line count threshold: 250 lines of source code only** (tests and generated files don't count toward limit)

### Step 4: Read Code Review Agent Instructions

Use the Read tool to get the code review guidelines:
```
Read: .claude/agents/code-review/AGENT.md
```

Extract the review criteria and output format from these instructions.

### Step 5: Invoke Code Review via Task Tool

Since custom agents aren't available in Task tool, use the `general-purpose` subagent with the code-review instructions.

Build the prompt:

**If source lines > 250:**
```
You are performing a code review following the guidelines in .claude/agents/code-review/AGENT.md.

[Include the key review criteria from the agent instructions]

Review the following code changes:

PR: #<NUMBER> - <TITLE>
Author: <AUTHOR>
Branch: <HEAD> -> <BASE>

Line count breakdown:
- Source code: <SOURCE_LINES> lines (limit: 250) ⚠️ EXCEEDS LIMIT
- Test code: <TEST_LINES> lines (no limit)
- Generated files: <GENERATED_LINES> lines (excluded)

Description:
<BODY>

This PR exceeds our 250-line limit for source code changes. First, suggest how to split this PR into logical chunks, then review the code.

Diff:
<DIFF_CONTENT>

CRITICAL: Start your response with exactly one of these verdict markers:
<!-- VERDICT: APPROVED -->
<!-- VERDICT: NOT_APPROVED -->
<!-- VERDICT: COMMENT -->

Follow the code-review agent format: provide concise verdict-driven feedback, only mention issues that need attention.
```

**If source lines <= 250:**
```
You are performing a code review following the guidelines in .claude/agents/code-review/AGENT.md.

[Include the key review criteria from the agent instructions]

Review the following code changes:

PR: #<NUMBER> - <TITLE>
Author: <AUTHOR>
Branch: <HEAD> -> <BASE>

Line count breakdown:
- Source code: <SOURCE_LINES> lines (limit: 250)
- Test code: <TEST_LINES> lines (no limit)
- Generated files: <GENERATED_LINES> lines (excluded)

Description:
<BODY>

Diff:
<DIFF_CONTENT>

CRITICAL: Start your response with exactly one of these verdict markers:
<!-- VERDICT: APPROVED -->
<!-- VERDICT: NOT_APPROVED -->
<!-- VERDICT: COMMENT -->

Follow the code-review agent format: provide concise verdict-driven feedback, only mention issues that need attention.
```

Use: `Task tool with subagent_type: "general-purpose"` and wait for the analysis.

### Step 6: Parse Verdict from Output

The output should include a hidden HTML comment at the start:
```html
<!-- VERDICT: APPROVED -->
<!-- VERDICT: NOT_APPROVED -->
<!-- VERDICT: COMMENT -->
```

Extract the verdict using string matching or regex.

**If parsing fails:**
- Default to "COMMENT" (safest option)
- Log warning: "⚠️ Could not determine verdict, posting as comment"

### Step 7: Map Verdict to GitHub Review Flag

**If source lines > 250:**
- Always use `--comment` (regardless of verdict)
- Rationale: Encourage splitting before approval

**If source lines <= 250:**
- `APPROVED` → `--approve`
- `NOT_APPROVED` → `--request-changes`
- `COMMENT` → `--comment`

### Step 8: Post Review to GitHub

Use the appropriate `gh pr review` command:

```bash
# For approve
gh pr review <PR_NUMBER> --approve --body "$REVIEW_OUTPUT"

# For request changes
gh pr review <PR_NUMBER> --request-changes --body "$REVIEW_OUTPUT"

# For comment
gh pr review <PR_NUMBER> --comment --body "$REVIEW_OUTPUT"
```

**Important:**
- The full review output becomes the review body
- Use proper escaping for the body content
- Handle multiline content correctly

**Example:**
```bash
REVIEW_BODY=$(cat <<'EOF'
$REVIEW_OUTPUT
EOF
)
gh pr review $PR_NUMBER --approve --body "$REVIEW_BODY"
```

### Step 9: Confirm to User

Report success to the user:
```
✓ Review posted to PR #<NUMBER>
Action: [Approved / Requested Changes / Comment]
Line breakdown:
  - Source code: <SOURCE_LINES> lines (limit: 250)
  - Test code: <TEST_LINES> lines
  - Generated files: <GENERATED_LINES> lines (excluded)
```

## Error Handling

### PR Number Missing
- Ask user: "Which PR number should I review?"

### gh Command Fails
- Check exit code
- Provide clear error message explaining what went wrong
- Common issues:
  - Not authenticated: "Run `gh auth login` to authenticate"
  - PR not found: "PR #<NUMBER> not found in this repository"
  - Permissions: "Insufficient permissions to access this PR"

### Line Counting Fails
- Log warning but continue with review
- Report: "⚠️ Could not count lines accurately, proceeding with review"
- Don't let counting failure block the review

### Task Tool Fails
- Don't post review to PR
- Report error to user: "Code review failed: <ERROR>"
- Provide error message for debugging

### Verdict Parsing Fails
- Default to `--comment`
- Include warning in output to user
- Still post the review (analysis is valuable)

### gh pr review Fails
- Report error to user
- Provide gh command output
- Suggest manual review if needed

## Edge Cases

### Very Small PRs (< 10 lines)
- Still run full review
- Analysis will be brief but thorough

### PR is Exactly 250 Lines
- Treat as acceptable (not oversized)
- Use normal verdict mapping

### PR Contains Only Non-Meaningful Changes
- Line count will be low
- Still run review (might note "no meaningful code changes")

### PR Has Multiple Reviews Already
- `gh pr review` creates a new review each time
- This is expected behavior (shows review history)

### Empty Diff (Closed/Merged PR)
- Report: "PR #<NUMBER> has no diff to review"
- Don't invoke analysis

## Example Flow

```
User: "Review PR #123"

1. Extract PR number: 123
2. Fetch PR data:
   - gh pr view 123 --json title,body,author,baseRefName,headRefName
   - gh pr diff 123
3. Count meaningful lines: 187
4. Read code-review agent instructions
5. Build prompt with PR context, diff, and review guidelines
6. Invoke Task tool with general-purpose agent
7. Agent returns review with: <!-- VERDICT: APPROVED -->
8. Parse verdict: APPROVED
9. Map to flag: --approve (since 187 <= 250)
10. Post review: gh pr review 123 --approve --body "$REVIEW"
11. Confirm: "✓ Review posted to PR #123, Action: Approved, Meaningful lines: 187"
```

## Key Review Criteria to Include in Prompt

When invoking the Task tool, include these key criteria from the code-review agent:

**Development Standards:**
- Single concern focus
- Avoid over-engineering
- Proper error handling
- Test coverage

**AI-Generated Code Red Flags:**
- Over-engineering
- Inconsistent patterns
- Missing error handling/tests

**Technical Standards:**
- Stencil patterns (if applicable)
- TypeScript type safety
- Security concerns
- Performance issues

**Output Format:**
- Start with verdict marker
- Concise feedback
- Only mention issues needing attention
- Blocking vs Suggestions sections

## Notes

- The verdict comment is hidden (HTML comment) but parseable
- Oversized PRs always get `--comment` to encourage splitting
- Line counting is best-effort; failures don't block review
- Multiple reviews on same PR are acceptable
- Skills run in my context (Claude), not in a subprocess
- Use general-purpose agent since custom agents aren't available in Task tool
