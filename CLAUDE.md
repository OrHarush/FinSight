# FinSight — Claude Working Guide

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
---

## React Component Patterns
- For loading states: always use skeleton components. Never mix loading logic into the actual component.
- Never create 2 components in the same file. Each component must be in its own file, even if it's small.
- If a component styles is too long, export it to a separate `styles.ts` file in the same folder.

## Naming Conventions
Functions describe **what they do**, never who calls them.

---
## UI / Layout Rules
- Use `Row` and `Column` (MUI Stack wrappers) for layout — not `Box`, `div`, or `Stack` directly. They must include children.
- Never use `vh`/`vw` for font sizes — use `rem` or `%`.
- No one-line `if` returns — always use curly braces and newlines.
- Add a blank line before `if` and `return` statements.
- Don't wrap components in unnecessary containers — apply `sx` directly.
- Always use `TextInput` (project shared component) instead of raw MUI `TextField`.
- All UI must support RTL and long translations — never assume English sizing.
---

## Backend Error Handling
Always throw `ApiError` static methods — never `new Error()` or `res.status().json()` directly:
Always use `ApiResponse` static methods:
Controllers are one-liners after the service call:
Never wrap service calls in try/catch inside controllers — global error middleware handles it.
---