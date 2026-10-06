# web-component-library Specifications

> Fintech Web Components for Saas

## How Specs Work

Specs are **steering documents** — they define WHAT to build and WHY, not HOW to implement.

**Workflow:**

1. **Spec phase** — We work through a spec until it's right
2. **Loop phase** — `loop.sh` runs agents that implement the spec
3. **Tracks** — [specd_history.md](../specd_history.md) records what's been implemented (done log)

**Agents have autonomy** on implementation. The spec steers direction, the agent decides the code.

**Status transitions.** Humans move specs from Draft → Ready. The `/specd:audit` command manages Ready ↔ Implemented transitions — promoting clean specs to Implemented, demoting specs with new findings back to Ready.

**Future items:** Items marked with `(future)` are for reference only. Do not implement them — they belong to a later phase or another spec.

**Dependencies:** If a feature depends on another spec, check that spec's status. Only implement if the dependency is Ready or Implemented. Mark blocked features with "(blocked: specname)".

**Versioning:** Specs use `v{major}.{minor}` versioning. Minor versions increment sequentially — v0.9 is followed by v0.10, not v1.0. Only increment the major version when explicitly instructed.

**Cross-references:** When referencing another spec in the body (Out of scope, Dependencies, inline text), use a real markdown link with the correct relative path. Changelog entries are historical records and use plain text names.

## Changelogs

Each spec has a Changelog section with human-readable summaries of what changed per version. Changelogs are a historical record — they describe WHAT changed and WHY, not granular implementation tasks.

```markdown
### v0.4 (2026-03-02)

- Added business user authentication alongside existing platform users
```

**Work items** live in [specd_work_list.md](../specd_work_list.md), not in spec changelogs. The `/specd:audit` command generates work items directly in specd_work_list.md based on gaps between specs and code. Humans and planning agents can also write directly to specd_work_list.md during spec phase.

## Tracks (Done Log)

[specd_history.md](../specd_history.md) is a record of completed work in reverse chronological order (newest first). Loop agents add entries after completing a work item. It prevents duplicate work and shows progress.

specd_history.md does NOT contain "Remaining" lists. [specd_work_list.md](../specd_work_list.md) is the source of truth for remaining work. An item is done when it's in specd_history.md.

## Status Legend

| Status      | Meaning                                                |
| ----------- | ------------------------------------------------------ |
| Draft       | Being specified — not ready for implementation         |
| Ready       | Spec complete, ready for implementation                |
| Implemented | Fully implemented                                      |
| Deprecated  | Superseded by another spec — kept for legacy reference |

---

## Foundation

| Spec | Version | Status | Description |
|------|---------|--------|-------------|
| [example-spec](example-spec.md) | v0.1 | Draft | Example spec showing the format |
| [core-component-merge](core-component-merge.md) | v0.1 | Ready | Merge wrapper/core component pairs into single components |

<!-- Add your foundation specs here -->

## Core

| Spec | Version | Status | Description |
|------|---------|--------|-------------|

<!-- Add your core feature specs here -->

## Future

| Spec | Version | Status | Description |
|------|---------|--------|-------------|

<!-- Add your future/planned specs here -->
