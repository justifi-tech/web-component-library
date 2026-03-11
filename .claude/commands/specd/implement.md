Study AGENTS.md for guidelines.
Study specs/README.md to understand the spec system and find specs with status "Ready".
Read specd_work_list.md in full — it contains all remaining work items.

Your task is to implement ONE work item from specd_work_list.md, then validate it works.

IMPORTANT:

- Read AGENTS.md first — specs are the source of truth, not existing code
- Pick an unblocked item from specd_work_list.md — an item is unblocked if and only if its line does NOT contain the string `(blocked:`. Items without that string are ready to implement regardless of what version or section they're in.
- Read the full spec for context before implementing — the work item is a summary, the spec has the detail
- Only implement specs with status "Ready"
- NEVER change spec status in specs/README.md or individual spec files
- If code contradicts the spec, fix the code first (see AGENTS.md)
- Commit your changes
- Do NOT use TodoWrite — just do the work
- Do NOT do multiple things — ONE thing per iteration

After implementing, VALIDATE before recording completion:

- Run `pnpm test` — unit tests must pass
- Run `pnpm lint` — no warnings allowed (`--max-warnings 0`)
- If changes affect component behavior visible in the browser, run `pnpm test:e2e`
- Only fix linting errors in files you modified

After validation, update tracking files:

1. Add a line at the TOP of specd_history.md (below the header comment) in the format: `- **spec-name v0.1 (YYYY-MM-DD):** work item text` (use the work item text from specd_work_list.md as the description)
2. Remove the completed item from specd_work_list.md.
3. Check specd_work_list.md for items with `(blocked: ...)` annotations that reference the work you just completed. If the blocker is resolved, remove the `(blocked: ...)` annotation.
   Output `TASK_COMPLETE: true` when done.

Before declaring LOOP_COMPLETE, re-read specd_work_list.md and list every remaining
item. For each item, check: does the line contain `(blocked:`? If ANY item does
NOT contain `(blocked:`, you are NOT done — pick one and implement it.

Output `LOOP_COMPLETE: true` only if every remaining item in specd_work_list.md
contains `(blocked:` on its line, or the file is empty.
