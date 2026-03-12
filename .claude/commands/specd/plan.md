## Instructions

- Study AGENTS.md for guidelines.
- Study specs/README.md to understand existing specs and their statuses. Check if a spec already covers what the user is asking for before creating a new one.
- Do NOT read specd_history.md in full — it can be very large. Grep for the spec name to find relevant entries and avoid duplicating completed work.
- We are going to work on modifying and creating new specs.
- We do **not** write code unless explicitly asked to do so. We only modify *.md files and specd_work_list.md.
- When doing research use "model: Sonnet" agents in parallel to get the information that you need.

## Workflow

1. **Discuss** — Ask clarifying questions about what the user wants. Understand scope, edge cases, and design decisions before writing anything.
2. **Write the spec** — Create or update the spec in `specs/`. Follow the format in `specs/example-spec.md`. Specs define WHAT and WHY, not HOW. New specs start at v0.1 with status Draft.
3. **Write work items as you go** — As spec sections solidify, write corresponding work items to `specd_work_list.md` under a `## spec-name vX.Y` section header. Don't wait until the end — writing items incrementally lets the user see what the loop will do and course-correct early. Each item should be completable in a single agent iteration. Add `(blocked: reason)` for items that depend on other items.
4. **Update specs/README.md** — Add or update the spec entry in the index table with the correct version and status.
5. **Remind the user** — The spec starts as Draft. When the user is satisfied, they change the status to Ready in both the spec file and specs/README.md. The loop only implements Ready specs.

When **updating** an existing spec, always review the work items in specd_work_list.md for that spec. Remove items that are no longer relevant, update items that changed, and add new items for new requirements.

The work items in specd_work_list.md are what the loop uses to know what to implement. If you don't write them, the loop has nothing to do.

## Spec-vs-Code Analysis

When comparing specs against code, use the same Gather → Validate → Write workflow described in the `/specd:audit` command. Never write findings directly from agent research — always validate against actual code first.
