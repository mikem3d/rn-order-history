# Mobile Engineer — Project Memory

> Durable, hard-won facts about **this** repo (Order History). The `mobile-engineer`
> agent reads this at the start of every task and appends to it whenever it learns
> something non-obvious that would save future-me time. One fact per bullet, newest
> first within a section, each tagged with the date it was learned `(YYYY-MM-DD)`.
> Keep it deduped and true — delete entries that become wrong.

## Environment & versions
- Expo SDK **56**, React Native **0.85.3**, React **19.2.3**, TypeScript ~6.0. (2026-06-11)
- React Navigation **v7** (native-stack), `@tanstack/react-query` **v5**,
  `react-native-safe-area-context` v5, `react-native-screens` v4. (2026-06-11)
- Testing: `jest-expo` 56 + `jest` 29 + `@testing-library/react-native` **13** +
  `react-test-renderer` 19. (2026-06-11)
- **Node gotcha:** only Node **23.5** is installed locally; RN 0.85 declares engines
  `^20.19 || ^22.13 || ^24.3 || >=25`, so `npm install` prints an `EBADENGINE`
  *warning*. It is advisory — tests, `tsc`, and a full `expo export` bundle all pass
  on Node 23. Recommend an LTS (20/22) for a warning-free install. The Homebrew
  `node@22` opt-link here is **dangling** (points at node 23.5); don't trust it. (2026-06-11)
- `@react-native/jest-preset` must be installed explicitly as a devDep — `jest-expo`
  declares it as a peer and errors without it. (2026-06-11)

## Conventions (follow these — they're load-bearing)
- **Money is always integer cents.** Never do arithmetic on dollars. Format only at
  the edge via `src/utils/money.ts` (`formatCents`). (2026-06-11)
- **Network access is funneled through `src/api/client.ts` + `src/api/orders.ts`.**
  Screens/hooks never call a transport directly — swapping the mock for `fetch` is a
  one-file change. (2026-06-11)
- **Server state lives in React Query.** Query keys are centralized in
  `src/hooks/useOrders.ts` (`orderKeys`) — add new keys there, never inline. (2026-06-11)
- **Presentational components are `React.memo`'d**; callbacks are `useCallback`'d and
  list `keyExtractor` is a stable module constant. Preserve prop-reference stability
  when editing — breaking it silently defeats the memoization. (2026-06-11)
- **Design tokens only** — colors/spacing/typography come from `src/theme/`. No
  hard-coded hex or magic numbers in components. (2026-06-11)
- **Dates** render in a fixed display timezone (`America/Los_Angeles` default) because
  the `Event` type carries no IANA zone; the instant is unambiguous (offsets are in
  the ISO strings). Tests pass an explicit `timeZone` for determinism. (2026-06-11)

## Gotchas
- `expo-file-system` v56 uses the **new** class API: `new File(Paths.cache, name)`,
  `.create()`, `.write(str)`, `.uri`, `.exists`, `.delete()`. The old
  `writeAsStringAsync`/`documentDirectory` functions are legacy (`expo-file-system/legacy`)
  and throw at runtime from the main entry. (2026-06-11)
- `@testing-library/react-native` **13** auto-extends Jest matchers; the old
  `import '@testing-library/react-native/extend-expect'` path **does not exist** and
  breaks the setup file. (2026-06-11)
- React Query leaves a GC timer that trips Jest's "worker failed to exit gracefully"
  warning. Set `gcTime: Infinity` in the test QueryClient to silence it. (2026-06-11)
- Calendar sharing uses a **pure** `.ics` builder (`src/utils/calendar.ts`, RFC 5545
  escaping + 75-octet line folding) kept separate from the side-effecting share
  (`src/utils/share.ts`) so the format is unit-testable without native modules. (2026-06-11)

## Key commands
- Run app on iOS sim: `npx expo start --ios` (Expo Go auto-installs the matching SDK build). (2026-06-11)
- Full check before a PR: `npm run typecheck && npm test`. (2026-06-11)
- Bundle smoke test (no device): `npx expo export --platform ios --output-dir /tmp/x`. (2026-06-11)
- Coverage: `npm run test:coverage`. Current baseline ~81% statements / 52 tests. (2026-06-11)

## Decisions
- Chose `.ics` calendar files over deep-linking a single provider for "Share with
  Friends" — universal, cross-provider, testable. (2026-06-11)
- Dark theme + typed navigation (`RootStackParamList`) chosen at scaffold time. (2026-06-11)
