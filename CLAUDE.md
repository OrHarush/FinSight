# Lyra — Claude Working Guide

## Stack
Frontend: React + TypeScript (Vite), MUI, TanStack Query, React Hook Form, i18next (EN/HE, RTL), PWA
Backend: Node.js + Express + MongoDB — layered architecture: Routes → Controllers → Services → Repositories
---

## Architecture Rules
- **Controllers**: HTTP only — extract params, call service, return response. No business logic.
- **Services**: All business logic. Never accept `req`/`res` objects.
- **Repositories**: All DB access. No query logic in services.
- **Frontend**: Server state → TanStack Query. Form state → React Hook Form. UI state → `useState` locally.
- **Dependency direction**: UI → hooks → API client. Never reverse.
---

## Clean Code (project-specific rules)
- One function does ONE thing. If you need "and" to describe it, split it.
- Pure logic never mixes with I/O, DB calls, or state mutations.
- Error handling lives in its own layer — never mix try/catch with happy-path logic.
- No business logic in controllers or React components.
- No `any` unless isolated and commented.
- Don't write any comments unless it's to explain "why" — never "what" or "how". If you need to explain "what", refactor the code to be self-explanatory. If you need to explain "how", extract it to a well-named function.
- Code should read top-to-bottom like a newspaper: lead with the high-level story, push details lower (stepdown rule). Optimize for readability and easy maintenance; prefer a few cohesive files over many tiny fragmented ones.
---

## React Component Patterns
- For loading states: always use skeleton components. Never mix loading logic into the actual component.
- Never create 2 components in the same file. Each component must be in its own file, even if it's small.
- If a component's styles grow complex, move them to a `styles.ts` file in the same folder. Export factory functions named `get[Component]Style` (e.g. `getChipStyle`, `getCardStyle`).
- **Don't `React.lazy()` route pages in `AppRoutes.tsx`.** The cached PWA serves a stale `index.html` referencing old chunk hashes; dynamic `import()` 404s and the user hits the ErrorBoundary (see commit `44e386c`). Static imports only — until we ship a `lazyWithRetry` wrapper + NetworkFirst SW strategy for `index.html`.

## Function Declaration Style
Always use `const` arrow functions — never `function` declarations:
```ts
// BAD
function splitExpenses(transactions, accountId) { ... }

// GOOD
const splitExpenses = (transactions: TransactionDto[], accountId: string) => { ... }
```

---
## Naming Conventions
Functions describe **what they do**, never who calls them.
```ts
// BAD
handleOpen, handleClose, handleToggle, handleClick, handleSubmit

// GOOD
openChipMenu, closeChipMenu, toggleSidebar, submitBudgetForm
```

---
## UI / Layout Rules
- Use `Row` and `Column` (MUI Stack wrappers) for layout — not `Box`, `div`, or `Stack` directly. They must include children.
- Never use `vh`/`vw` for font sizes — use `rem` or `%`.
- No one-line `if` returns — always use curly braces and newlines.
- Add a blank line before `if` and `return` statements.
- Don't wrap components in unnecessary containers — apply `sx` directly.
- Always use `TextInput` (project shared component) instead of raw MUI `TextField`.
- All UI must support RTL and long translations — never assume English sizing.
- Always use `CurrencyText` to display currency values — never raw numbers, `toLocaleString`, or manual `+`/`−`/`₪` wrapping. Use its `hasSign` (auto `+` on positives) and `hasColor` (success/error tint by sign) props. For values that should display as subtractions (e.g. expenses in a breakdown), pass the negated value so `CurrencyText` formats and colors them as negative.
---

## Modals & confirmations

- **Content panels** (settings, management, multi-field forms) → centered dialog on desktop, bottom sheet on mobile. Responsive container.
- **Confirmations** (delete, leave, remove, "are you sure" — short, focused, destructive or decisive) → centered alert dialog on BOTH desktop and mobile. Never a bottom sheet, never stacked sheet-on-sheet.
- Destructive action button: visually distinct (red/danger). Keep the safe action (cancel) as the calm default. Position matters less than visual weight.
- One reusable confirm-dialog component for all confirmations — vary only the copy.

In `LyraDialog`, pass `forceDialog` for confirmations so they render as a centered modal on every breakpoint. Default `forceDialog={false}` keeps the responsive bottom-sheet-on-mobile behavior for content panels.

- **Action button placement differs by surface.** Desktop dialogs: buttons sized-to-text, grouped, primary placed by RTL reading-flow (eye ends bottom-left). Mobile bottom sheets: buttons stretch full-width as a split row across the bottom (primary larger/filled, secondary smaller), thumb-reachable — never clustered small in one corner. Same component, responsive button layout.
---

## Backend Error Handling
Always throw `ApiError` static methods — never `new Error()` or `res.status().json()` directly:
Always use `ApiResponse` static methods:
Controllers are one-liners after the service call:
Never wrap service calls in try/catch inside controllers — global error middleware handles it.
---


## Event Collections (MongoDB)

Every model that stores events must be classified as one of:

- **Audit** — security-relevant "who did what": login, logout, account deletion, data export, consent changes, admin actions. TTL: 7 years if the collection covers *all* such events for the app; otherwise 365 days.
- **Analytics** — product behavior: feature usage, installs, funnels, screen views. TTL: 365 days on `createdAt`, per the privacy policy.

Default to **analytics** when ambiguous. Every new event collection must have:
1. A TTL index on `createdAt`
2. A comment on the schema stating which class it is and why

---

## Database Scripts

Standalone scripts that touch MongoDB (migrations, backfills, cleanups, restores) must include — by default, without asking:

1. **Confirmation gate.** Parse db name from `MONGO_URI`, print it, require an exact retype before connecting. Abort on mismatch. Extra `!!! PRODUCTION DATABASE !!!` warning when db is `lyra`.
2. **`--dry-run` flag.** Performs all reads and logs every planned change (counts, affected `_id`s, would-insert/update/delete) but writes nothing. Still passes through the confirmation gate. Also accept `DRY_RUN=1` env var — npm 7+ swallows `--dry-run` as its own reserved flag, so the env var is the bulletproof invocation. Print a loud `MODE: DRY RUN / LIVE` banner at startup right after parsing argv so the resolved mode is impossible to miss.
3. **Per-record logging.** Log each entity (`_id` or identifier) so a mid-run failure is forensically reconstructable.
4. **Idempotency.** Re-runs must be safe and produce no duplicate effects.

Canonical patterns: `server/scripts/restore-backup.ts`, `server/scripts/migrate-workspaces.ts`.

---

## Git Commit Messages

- When the user explicitly asks for a commit message, give a single-line conventional-commit (`type(scope): summary`). No body, no bullets, no Co-Authored-By line — just one line. Don't volunteer commit messages unprompted.

---

## Secrets & Local Dev

- **Never read `.env`** — it contains real secrets.
- Port overrides for parallel dev are in `.env.claude` (ports only, no credentials).
- If a value isn't in `.env.claude`, ask the user — don't try to read `.env`.
- To run Lyra locally, always use `npm run dev:claude` in both `client/` and `server/` (ports 3001/5001). Never use `npm run dev` — it would collide with the user's session on 3000/5000. The server loads `.env.claude` first then `.env` as fallback, so secrets reach the running process without Claude ever opening `.env`.