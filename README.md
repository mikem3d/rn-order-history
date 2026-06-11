# Order History

A React Native (Expo) app for viewing past ticket purchases and sharing events
with friends as calendar invites.

<p align="center">
  <em>List of past orders → tap → order detail with receipt → "Share with Friends" → native share sheet with a calendar (.ics) invite.</em>
</p>

## Features

- **Order history list** — past purchases, newest first, with event art, status,
  ticket count, and total. Pull-to-refresh, loading / error / empty states.
- **Order detail** — event info, seats, an itemized receipt (subtotal, fees, tax,
  discount, total), and payment summary.
- **Share with Friends** — generates a standards-compliant iCalendar (`.ics`)
  event and opens the native share sheet. Recipients tap to add it to Apple
  Calendar, Google Calendar, Outlook, etc.
- **Simulated backend** — `GET /orders` and `GET /orders/:orderId` are mocked
  with realistic latency and optional failure injection. No live backend needed.
- **Tests** — 52 tests across the API layer, utilities, components, and a screen
  integration test.

## Running locally

> **Prerequisites:** Node.js (an LTS — **20.19+ or 22.13+** is recommended; see
> [note on Node version](#a-note-on-node-version)) and the
> [Expo Go](https://expo.dev/go) app on your phone, or an iOS Simulator /
> Android emulator.

```bash
npm install
npm start
```

Then:

- **Physical device:** scan the QR code with Expo Go (Android) or the Camera app (iOS).
- **iOS Simulator:** press `i` in the terminal.
- **Android emulator:** press `a` in the terminal.
- **Web preview:** press `w` (note: the native share sheet falls back to the JS
  `Share` API on web).

### Tests & type-checking

```bash
npm test              # run the full suite
npm run test:coverage # with a coverage summary
npm run typecheck     # tsc --noEmit
```

## Architecture

```
App.tsx                     Providers: React Query, SafeArea, Navigation (dark theme)
src/
├── api/
│   ├── types.ts            The provided domain types (Order, Event, Receipt, …)
│   ├── mockData.ts         Seed orders covering every status / payment variant
│   ├── client.ts           Simulated network: latency + failure injection + ApiError
│   └── orders.ts           getOrders() / getOrder() — mirrors the REST endpoints
├── hooks/
│   └── useOrders.ts        React Query hooks + centralized query keys
├── navigation/             Native stack: OrderList → OrderDetail (typed routes)
├── screens/
│   ├── OrderListScreen.tsx
│   └── OrderDetailScreen.tsx
├── components/             Presentational, memoized building blocks
│   ├── OrderCard, StatusBadge, EventHeader, SeatList,
│   ├── ReceiptBreakdown, Section, ShareButton, StateViews
├── utils/
│   ├── money.ts            cents → "$1,234.56"
│   ├── date.ts             timezone-aware date/time formatting
│   ├── payment.ts          "Visa •••• 4242"
│   ├── calendar.ts         pure .ics (iCalendar) builder
│   └── share.ts            writes the .ics and opens the share sheet
├── theme/                  Design tokens (colors, spacing, typography)
└── test-utils/             renderWithProviders helper
```

### Key decisions

- **Data layer is swappable.** All "network" access is funneled through
  `api/client.ts` and `api/orders.ts`. Replacing the mock with `fetch` against a
  real API is a one-file change — screens and hooks don't know it's mocked.
- **React Query** for server state. It gives caching, dedup, loading/error
  flags, retries, and pull-to-refresh almost for free, and keeps components
  declarative. Query keys live in one module to prevent cache-key drift.
- **Money as integer cents, everywhere.** The UI never does arithmetic on
  dollars — only formatting at the edge — which avoids floating-point rounding
  bugs in receipts.
- **Calendar sharing via `.ics`.** An iCalendar file is the universal,
  cross-platform, multi-provider way to "share an event." It beats deep-linking a
  single calendar provider. `buildICS()` is a **pure function** (RFC 5545 escaping
  + line folding) so it's fully unit-testable; the file I/O and share sheet live
  in a thin, separately-mocked layer.
- **Render performance.** List rows and detail sub-components are wrapped in
  `React.memo`; callbacks (`renderItem`, `onPress`) are `useCallback`-memoized and
  `keyExtractor` is a stable module constant, so `FlatList` rows don't re-render on
  scroll or refresh.
- **Typed navigation** end-to-end via `RootStackParamList`.

### Testing strategy

The suite favors fast, deterministic tests at the layers where bugs actually hide:

| Layer | Examples |
|---|---|
| **Utilities** (pure) | money/date/payment formatting, RFC-5545 `.ics` generation & escaping |
| **API** | sort order, pagination, 404/503 error paths via failure injection |
| **Components** | `OrderCard`, `ReceiptBreakdown` (incl. discount/no-discount), `ShareButton` (double-tap guard) |
| **Share flow** | `.ics` is written and the share sheet opens; errors never throw |
| **Screen integration** | `OrderListScreen` loads → renders → navigates on tap |

Native modules (`expo-sharing`, `expo-file-system`) are mocked in `jest.setup.js`
so tests run in plain Node without a device.

## Project agents (Claude Code)

This repo ships three purpose-built [Claude Code](https://claude.com/claude-code)
subagents in `.claude/agents/`, plus a living memory file. They encode senior/
staff-level knowledge of this codebase so day-to-day work (building features,
QA-ing the running app, reviewing PRs) is fast and consistent.

| Agent | Role | Can edit code? | Notable tools |
|---|---|---|---|
| **`mobile-engineer`** | Staff RN/Expo engineer. Implements features, fixes bugs, writes tests, and **opens pull requests**. | ✅ | full toolset + `gh` |
| **`qa-engineer`** | Senior SDET. **Drives the running app** on a simulator/device to verify flows and file bug reports. | ❌ (reports only) | `mobile-mcp` + `Bash` |
| **`pr-reviewer`** | Staff reviewer. Reviews a PR / branch / working diff against a RN-tuned rubric. | ❌ (read-only) | `Bash, Read, Grep, Glob, WebFetch` |

### Persistent memory
`.claude/memory/mobile-engineer.md` is a curated log of hard-won, repo-specific
facts (version quirks, gotchas, conventions, key commands). The `mobile-engineer`
agent **reads it at the start of every task and appends to it** whenever it learns
something durable and non-obvious — so the codebase's institutional knowledge
compounds instead of evaporating. It's plain Markdown; read or edit it yourself any
time.

### How to use them

These are [subagents](https://docs.anthropic.com/en/docs/claude-code/sub-agents).
From a Claude Code session in this repo, invoke them by intent — Claude auto-delegates
based on each agent's description, or you can name one explicitly:

```text
# Build something and open a PR
"Use the mobile-engineer to add infinite scroll to the order list and open a PR."

# QA the running app
"Have the qa-engineer smoke-test the share-with-friends flow on the simulator."

# Review a change
"Have the pr-reviewer review PR #12."
"Have the pr-reviewer review the current branch against main."
```

A typical loop: **mobile-engineer** implements + opens a PR → **pr-reviewer** reviews
it → **qa-engineer** validates it on a device → mobile-engineer addresses findings and
records anything learned in memory.

### One-time setup for the QA agent (`mobile-mcp`)

The `qa-engineer` drives the app through the
[mobile-mcp](https://github.com/mobile-next/mobile-mcp) server. It's pre-registered in
`.mcp.json` (project scope), but you must approve and load it once:

```bash
# Already added for you; if you ever need to re-add it:
claude mcp add -s project mobile-mcp -- npx -y @mobilenext/mobile-mcp@latest
```

Then **approve the server** when Claude Code prompts and **restart the session** so its
tools load. Prerequisites: **iOS** → Xcode + a booted Simulator (`xcrun simctl`);
**Android** → Android SDK + `adb` with an emulator/device. If the tools aren't present,
the `qa-engineer` will detect that and print the exact install steps rather than failing.

## Tradeoffs & what I'd do with more time

- **Timezones.** The provided `Event` type has no IANA timezone, so event times
  are displayed in a fixed venue timezone (`America/Los_Angeles` by default). The
  underlying instant is always correct (offsets are in the ISO strings), so the
  `.ics` is unambiguous. Production: store an IANA zone per venue.
- **Pagination.** `getOrders` already supports `page`/`perPage` and the hooks are
  ready; I'd wire up infinite scroll (`useInfiniteQuery`) with a larger dataset.
- **Images.** Using remote Unsplash URLs for event art; I'd add caching
  (`expo-image`) and graceful fallbacks for broken images.
- **More E2E coverage.** A Detox/Maestro smoke test of the full tap-through-share
  journey on a simulator.
- **Accessibility & polish.** Roles/labels are in place; I'd add dynamic-type
  scaling, skeleton loaders, and haptics on share.
- **Error reporting & analytics** hooks around the share action and API failures.

### A note on Node version

React Native 0.85 lists its supported Node engines as
`^20.19.4 || ^22.13.0 || ^24.3.0 || >=25`. This project was built and verified on
Node 23 — the test suite, `tsc`, and a full Metro bundle (`expo export`) all pass
— but you may see an `EBADENGINE` **warning** on install. For a warning-free
experience, use an LTS release (20 or 22).
