You are helping set up a new specd project. The framework files have already been installed via `specd init`. Your job is to customize them for this specific project.

Study the codebase first — read existing code, build files, configs, package manifests, Dockerfiles, Makefiles, CI configs, and anything that reveals the tech stack, conventions, and project structure.

Then work through each step interactively with the human. Ask questions, propose answers based on what you found, and get confirmation before writing.

## Step 1: AGENTS.md — Build & Test

Read AGENTS.md. The Build & Test section has a placeholder comment.

Based on what you found in the codebase, propose concrete build and test commands. Examples:
- `make check`, `cargo test`, `go test ./...`, `npm test`, `pytest`
- Linters, formatters, type checkers
- Integration test commands if they exist

Ask the human to confirm or adjust, then update the section.

## Step 2: AGENTS.md — Conventions

The Conventions section has a placeholder comment.

Based on the codebase, propose language-specific conventions:
- Language and version
- Naming conventions (casing, prefixes)
- Import ordering
- Error handling patterns
- Any patterns you see repeated in the existing code

Ask the human to confirm or adjust, then update the section.

## Step 3: .claude/commands/specd/implement.md — Validation

Read `.claude/commands/specd/implement.md`. The validation section has a placeholder comment.

Propose concrete validation steps that match this project's tooling:
- Test command(s) to run
- Lint/format checks
- Type checking
- Any other pre-commit validation

Ask the human to confirm or adjust, then update the section.

## Step 4: First spec

Ask the human what they want to build first. Help them write a spec following the format in `specs/example-spec.md`.

- Start at Draft status
- Fill in Overview, Scope, Dependencies, and as much of the Specification section as they're ready for
- Add it to the phase table in `specs/README.md`

If the project already has code, offer to audit what exists and propose specs that describe the current state (these would start as Implemented).

## Step 5: Clean up

- Delete `specs/example-spec.md` and remove its row from `specs/README.md` (unless the human wants to keep it as reference)
- Ask if there's anything else they want to customize

## Rules

- Do NOT write code — only markdown files
- Ask before writing to any file
- One step at a time — don't rush ahead
- If the codebase is empty (new project), skip the code analysis parts and just ask directly
