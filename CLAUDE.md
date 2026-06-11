# CLAUDE.md

Guidance for Claude Code when working in this repo (the **Order History** RN/Expo app).

@AGENTS.md

## Specialized agents (`.claude/agents/`)
Prefer delegating to the right subagent — they hold deep, repo-specific knowledge:
- **`mobile-engineer`** — feature work, bug fixes, refactors, tests, and opening PRs.
  Reads and updates `.claude/memory/mobile-engineer.md` every task.
- **`qa-engineer`** — drives the running app via the `mobile-mcp` server to verify
  flows and file bug reports (read-only; needs `mobile-mcp` installed + approved).
- **`pr-reviewer`** — reviews PRs / branch diffs against a RN-tuned rubric (read-only).

## Memory
`.claude/memory/mobile-engineer.md` is the project's durable knowledge base (versions,
gotchas, conventions, commands). Read it before non-trivial work; append durable,
non-obvious facts you learn (dated, deduped).

## Conventions (load-bearing — see memory for the why)
- **Money is integer cents end-to-end.** Format only at the edge (`src/utils/money.ts`).
- **All "network" goes through `src/api/client.ts` + `src/api/orders.ts`.** Keep that
  seam swappable; screens/hooks never call a transport directly.
- **Server state = React Query.** Cache keys live in `orderKeys` (`src/hooks/useOrders.ts`).
- **Presentational components are `React.memo`'d**; keep prop/callback references stable.
- **Design tokens only** (`src/theme/`). **Typed navigation** via `RootStackParamList`.

## Commands
- `npm start` / `npx expo start --ios` — run the app (use Node 20/22 LTS).
- `npm run typecheck` — `tsc --noEmit`.
- `npm test` / `npm run test:coverage` — Jest suite (52 tests).
- Bundle smoke test: `npx expo export --platform ios --output-dir /tmp/x`.

## Definition of done
Typecheck clean + tests pass (with tests added for changed behavior) + reachable
loading/error/empty states + list/scroll perf preserved. Run the commands; report real
results. See `README.md` for full architecture and tradeoffs.
