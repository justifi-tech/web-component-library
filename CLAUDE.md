## Rules

- Be extremely concise in interactions and commit messages. Sacrifice grammar for concision.
- All package scripts are allowed — `test`, `test:e2e`, `lint`, `build`, `dev`, `start`, `dev:server`, `format`, `clean`. Two have wide blast radius, so say what you're doing first: `format` rewrites every `.ts/.tsx/.md` in the repo, and `clean` deletes `node_modules` (reinstall with `pnpm install`).
- Always verify tests pass and lint is clean before marking work complete.
- When working on E2E tests, **always read** `apps/component-examples/e2e/README.md` first.
- How to write a test: `.claude/skills/testing/SKILL.md`.

## Commands

```bash
pnpm --filter @justifi/webcomponents test            # spec suite (fast — skips turbo's build)
pnpm --filter @justifi/webcomponents test -- <name>  # one file or test name
pnpm --filter @justifi/webcomponents lint            # lint
pnpm build                                           # turbo build
pnpm test                                            # turbo test — builds first
pnpm test:e2e                                        # E2E; starts :3000 itself if nothing serves it
pnpm dev:server                                      # stencil watch + examples server — never exits, background it
```

Prefer the `--filter` form for spec runs: spec tests compile their own sources, so turbo's `build` step buys nothing. Read the output for `Tests:`; a piped exit code is the pipe's.

## API Documentation

- [JustiFi API](https://developer.justifi.ai/)
- [API Spec](https://docs.justifi.tech/api-spec)
