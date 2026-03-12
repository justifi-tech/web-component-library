Study AGENTS.md for guidelines.

Your task is to process specd_review.md — move approved items into specd_work_list.md, then clear them from specd_review.md.

PROCESS:

1. Read specd_review.md. If the file is empty or doesn't exist, output `REVIEW_INTAKE_COMPLETE: true` and stop.
2. For each finding in specd_review.md:
   - Read the referenced spec for context
   - Create a concrete, actionable work item in specd_work_list.md under the correct `## spec-name vX.Y` section
   - If the finding requires a spec change, update the spec: bump version, add a changelog entry with human-readable summary, then add the work item to specd_work_list.md under the new version
3. After all items are moved, clear the processed entries from specd_review.md.
4. Output `REVIEW_INTAKE_COMPLETE: true` when done.

RULES:

- Each work item must be a small, single unit of work — one agent can complete it in one iteration
- If a work item depends on another, add `(blocked: dependency description)` at the end
- Use the exact specd_work_list.md format: section headers are `## spec-name vX.Y`, items are `- description`
- Do NOT implement anything — only populate specd_work_list.md
