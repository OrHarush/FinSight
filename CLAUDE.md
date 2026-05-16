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
---

## React Component Patterns
- For loading states: always use skeleton components. Never mix loading logic into the actual component.
- Never create 2 components in the same file. Each component must be in its own file, even if it's small.
- If a component's styles grow complex, move them to a `styles.ts` file in the same folder. Export factory functions named `get[Component]Style` (e.g. `getChipStyle`, `getCardStyle`).

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

## Backend Error Handling
Always throw `ApiError` static methods — never `new Error()` or `res.status().json()` directly:
Always use `ApiResponse` static methods:
Controllers are one-liners after the service call:
Never wrap service calls in try/catch inside controllers — global error middleware handles it.
---


## Secrets & Local Dev

- **Never read `.env`** — it contains real secrets.
- Port overrides for parallel dev are in `.env.claude` (ports only, no credentials).
- If a value isn't in `.env.claude`, ask the user — don't try to read `.env`.
- To run Lyra locally, always use `npm run dev:claude` in both `client/` and `server/` (ports 3001/5001). Never use `npm run dev` — it would collide with the user's session on 3000/5000. The server loads `.env.claude` first then `.env` as fallback, so secrets reach the running process without Claude ever opening `.env`.