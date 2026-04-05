# Lyra Architecture

## Monorepo Structure

```
Lyra/
├── client/      React + TypeScript (Vite, MUI, TanStack Query, RHF, i18next)
├── server/      Node.js + Express + MongoDB
├── shared/      @lyra/shared — Zod schemas and shared types
└── package.json npm workspaces root
```

npm workspaces link `@lyra/shared` into `client/node_modules` and
`server/node_modules` so both import it as a normal package.

### What belongs where

| Package | Contains |
|---------|----------|
| `client/` | Pages, components, hooks, API client, i18n, assets |
| `server/` | Routes, controllers, services, repositories, Mongoose models |
| `shared/` | Zod schemas (`schemas/`), static types (`types/`) — no runtime deps on client or server |

---

## Shared Package (`@lyra/shared`)

### `shared/schemas/`

One file per entity. Each file exports:
- A Zod schema for the Create operation (`CreateXSchema`)
- A Zod schema for the Update operation (`UpdateXSchema`)
- Query schemas where needed (`GetXSchema`)
- A separate form schema when the form field names differ from API field names
- Types derived via `z.infer<>` — never written by hand

```ts
// shared/schemas/account.ts
export const CreateAccountSchema = z.object({
  name: nameSchema(40),
  balance: amountSchema,
  // ...
});
export type CreateAccountDTO = z.infer<typeof CreateAccountSchema>;
```

`shared/schemas/common.ts` contains reusable primitives:
- `objectIdSchema` — 24-hex-char MongoDB ObjectId
- `nameSchema(max)` — min 1, max N, trimmed
- `amountSchema` — non-zero, bounded ±999,999,999
- `positiveAmountSchema` — >0, bounded

### `shared/types/`

Static types with no Zod schema (colors, roles, feedback commands, default category shapes).
These are hand-written because they describe static enumerations, not validated input.

### `shared/index.ts`

Re-exports everything so consumers import from a single entry point:

```ts
import { CreateBudgetDTO, BudgetFormSchema } from '@lyra/shared';
```

---

## Zod as the Single Source of Truth

### Why

Before this refactor:
- `server/src/schemas/` had budget-only Zod schemas with bugs (0-based month, limit allowed 0)
- `shared/types/*Commands.ts` had hand-written interfaces (`CreateAccountCommand`, etc.) that drifted from actual validation rules
- Client forms defined their own `FormValues` interfaces and used RHF native rules (`required`, `min`, `max`) that did not share logic with the server

After:
- One schema per entity, one place to change validation rules
- Server middleware and client resolver both run the same schema
- Types are derived from schemas — they cannot drift

### Zod v4 syntax

The project uses Zod v4. Notable conventions:
- Primitive error messages use `{ error: 'validation.key' }` — e.g. `z.number({ error: 'validation.invalidNumber' })`
- Cross-field errors use raw string issue codes: `code: 'custom'`
- String refinements take the message directly: `z.string().min(1, 'validation.required')`

---

## Validation Pattern — Full Stack Flow

### 1. Schema defined once in `shared/`

```ts
// shared/schemas/budget.ts
export const CreateBudgetSchema = z.object({
  categoryId: objectIdSchema,
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  limit: positiveAmountSchema,
});
export type CreateBudgetDTO = z.infer<typeof CreateBudgetSchema>;
```

### 2. Server: middleware → controller → service

```ts
// server/src/routes/budgetRoutes.ts
router.post('/', validateBody(CreateBudgetSchema), createBudget);

// server/src/controllers/budgetController.ts
export const createBudget = asyncHandler(async (req, res) => {
  const budget = await budgetService.create(
    req.validatedBody as CreateBudgetDTO,
    req.userId
  );
  return ApiResponse.created(res, budget);
});
```

`validateBody` runs `schema.safeParse(req.body)`. On failure it throws
`ApiError.badRequest(...)`. On success it sets `req.validatedBody`.
Controllers never touch `req.body` directly.

### 3. Client: zodResolver in useForm → TextInput renders errors

```ts
// CreateBudgetDialog.tsx
const methods = useForm<BudgetFormValues>({
  resolver: zodResolver(BudgetFormSchema),
});
```

```tsx
// BudgetForm.tsx
<TextInput name="limit" label={t('dialog.limitLabel')} type="number" />
```

`TextInput` calls `t(fieldState.error.message)` — Zod error messages are i18n keys,
not raw strings. No `required`, `min`, or `max` props needed when the form uses `zodResolver`.

---

## Form Schemas vs API Schemas

Some entities have two schemas because the form field names differ from the API field names.

**Budget example:**

```ts
// Form collects: { category: string, limit: number }
export const BudgetFormSchema = z.object({
  category: objectIdSchema,  // dropdown value = category _id
  limit: positiveAmountSchema,
  applyToRestOfYear: z.boolean().optional(),
});

// API expects: { categoryId: string, year: number, month: number, limit: number }
export const CreateBudgetSchema = z.object({
  categoryId: objectIdSchema,
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
  limit: positiveAmountSchema,
});
```

The dialog transforms on submit:

```ts
const submitCreate = async (data: BudgetFormValues) => {
  await createBudget.mutateAsync({
    categoryId: data.category,
    year,
    month: month + 1,  // UI stores 0-based (dayjs), API expects 1-based
    limit: data.limit,
  });
};
```

**Transaction** follows the same pattern — `TransactionFormSchema` uses
`category`, `account`, `fromAccount`, `toAccount`; the API schema uses
`categoryId`, `accountId`, `fromAccountId`, `toAccountId`.
`mapTransactionFormValuesToPayload()` in `client/src/utils/transaction.ts`
handles the transform.

**PaymentMethod** uses `PaymentMethodFormSchema` (aliased from `CreatePaymentMethodSchema`)
for both create and edit dialogs. The mapper in `client/src/utils/paymentMethod.ts`
strips fields that are not applicable to the selected type (e.g. `billingDay` when type
is not Credit Card) before sending to the API.

---

## i18n Validation Messages

All Zod `message` strings are i18n keys in the `validation.*` namespace:

```ts
nameSchema(30) // emits 'validation.required', 'validation.nameTooLong'
amountSchema   // emits 'validation.invalidNumber', 'validation.amountZero', etc.
```

Keys live in:
- `client/src/locales/en/common.json`
- `client/src/locales/he/common.json`

`TextInput` translates them: `t(fieldState.error.message)`.
Server validation errors are returned as-is in the API response (no translation needed server-side).

---

## What Not To Do

**Never define a type manually if a Zod schema exists for that shape.**

```ts
// BAD
interface CreateAccountInput { name: string; balance: number; }
// GOOD
type CreateAccountDTO = z.infer<typeof CreateAccountSchema>;
```

**Never use `req.body` directly in controllers.**

```ts
// BAD
const body = req.body as CreateAccountCommand;
// GOOD
const body = req.validatedBody as CreateAccountDTO;
```

**Never pass validation props to `TextInput` when using `zodResolver`.**

```tsx
// BAD — double validation, Zod and RHF fight each other
<TextInput name="limit" required min={0.01} max={999999} />
// GOOD — Zod owns all validation rules
<TextInput name="limit" />
```

**Never add a `server/src/schemas/` directory.** Schemas belong in `shared/`.
The directory was deleted; keep it that way.

**Never put business validation in controllers.** Structural validation (shape, types, ranges)
lives in Zod. Domain validation (category ownership, account existence) lives in services.

---

## Canonical Example: Budget Entity

The budget entity is the cleanest end-to-end example of the correct pattern:

| Layer | File | Pattern |
|-------|------|---------|
| Schema | `shared/schemas/budget.ts` | `CreateBudgetSchema`, `BudgetFormSchema`, `GetBudgetsSchema` |
| Server route | `server/src/routes/budgetRoutes.ts` | `validateBody(CreateBudgetSchema)`, `validateQuery(GetBudgetsSchema)` |
| Controller | `server/src/controllers/budgetController.ts` | `req.validatedBody as CreateBudgetDTO` |
| Service | `server/src/services/budgetService.ts` | Pure business logic, no shape checks |
| Client form | `client/src/pages/Budgets/components/BudgetForm.tsx` | `TextInput` only, no validation props |
| Client dialog | `client/src/pages/Budgets/components/dialogs/CreateBudgetDialog.tsx` | `zodResolver(BudgetFormSchema)`, transforms on submit |
