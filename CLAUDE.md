## Rules

- Be extremely concise in interactions and commit messages. Sacrifice grammar for concision.
- **Do not run** `build`, `dev`, `start`, `lint`, `format`, `clean`. Only `test` and `test:e2e` commands are allowed.
- Always verify tests pass before marking work complete.
- When working on E2E tests, **always read** `apps/component-examples/e2e/README.md` first.

## Key Paths

| What | Path |
|---|---|
| Components source | `packages/webcomponents/src/components/` |
| Unit tests | `packages/webcomponents/src/components/**/*.spec.ts` |
| E2E tests | `apps/component-examples/e2e/` |
| E2E example pages | `apps/component-examples/examples/` |
| Project reference | `docs/ai/project-reference.md` |

## Commands

```bash
pnpm test                              # All unit tests
pnpm test -- --testPathPattern=<path>  # Single file
pnpm test:e2e                          # All e2e tests
pnpm test:e2e:ui                       # Interactive UI mode
```

## Documentation

- [JustiFi API](https://developer.justifi.ai/)
- [Web Component Docs](https://storybook.justifi.ai/?path=/docs/introduction--docs)
- [Project Reference](docs/ai/project-reference.md) — project structure, code conventions, workflow guidelines
