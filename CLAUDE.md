## Rules

- Be extremely concise in interactions and commit messages. Sacrifice grammar for concision.
- All package scripts are allowed — `test`, `test:e2e`, `lint`, `build`, `dev`, `start`, `dev:server`, `format`, `clean`. Two have wide blast radius, so say what you're doing first: `format` rewrites every `.ts/.tsx/.md` in the repo, and `clean` deletes `node_modules` (reinstall with `pnpm install`).
- Always verify tests pass and lint is clean before marking work complete.
- When working on E2E tests, **always read** `apps/component-examples/e2e/README.md` first.
- How to write a test: `.claude/skills/testing/SKILL.md`.
- Touching a `@Prop()` JSDoc, a `@Part`, or anything in `docs/helpers/`? **Look at the rendered docs tables, don't just read the diff.** `pnpm --filter @justifi/webcomponents-docs preview:tables` renders every component's props and parts table and opens the page. These tables are generated from the JSDoc through `docs.json`, so a comment can break a published page with no .mdx edit and no failing spec — a newline in a description ends the markdown row, truncating the table and spilling every prop below it onto the page as raw text. That shipped in 6.16 and reached production.

## Commands

```bash
pnpm --filter @justifi/webcomponents test            # spec suite (fast — skips turbo's build)
pnpm --filter @justifi/webcomponents test -- <name>  # one file or test name
pnpm --filter @justifi/webcomponents lint            # lint
pnpm build                                           # turbo build
pnpm test                                            # turbo test — builds first
pnpm test:e2e                                        # E2E; starts :3000 itself if nothing serves it
pnpm dev:server                                      # stencil watch + examples server — never exits, background it
pnpm --filter @justifi/webcomponents-docs preview:tables   # render the docs tables and open them
```

Prefer the `--filter` form for spec runs: spec tests compile their own sources, so turbo's `build` step buys nothing. Read the output for `Tests:`; a piped exit code is the pipe's.

`preview:tables` needs a `pnpm build` first — it reads the generated `docs.json`. The same script without `--open` is the docs package's `test`, so `pnpm test` fails CI on a broken table; `preview:tables` is for when you want to see the page.

## API Documentation

- [JustiFi API](https://developer.justifi.ai/)
- [API Spec](https://docs.justifi.tech/api-spec)
