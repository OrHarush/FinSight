# Recurring Transactions

For general architecture patterns (layering, error handling, DTO conventions) see `ARCHITECTURE.md`.

---

## Overview

Two-model design: **`RecurringTemplate`** holds the rule; **`Transaction`** holds the fact.

Templates never appear directly in the UI. They exist to produce real Transaction documents and, for months that haven't been generated yet, in-memory *virtual* (ghost) transactions that are injected at query time.

---

## How It Works

**Generation (nightly cron)**
`generatePendingTransactions(userId)` runs from the nightly cron at 02:00 (see `docs/CRON.md`). Login does **not** trigger it — login only syncs account balances. The function iterates every active template, walks month-by-month from `lastGeneratedDate + 1 month` up to the current month, and inserts one Transaction per qualifying month. `lastGeneratedDate` is updated on the template after each run so months are never double-generated. The same function also runs once when a template is created (via `createWithTransactions`) so past and current months land immediately.

A per-month dedupe guard (`transactionRepository.findOneByTemplateAndMonth`) skips months that already have a real row. This is what protects against duplicating a materialized override (see Edit Flow).

`clampedDate` handles months shorter than `dayOfMonth` (e.g. day 31 in February → Feb 28/29).

**Virtual transactions (future months)**
`transactionService.findAll` checks if the query window extends into the future. For each active template, it constructs in-memory `ITransactionPopulated` objects for future months — same shape as real transactions but with `isVirtual: true` and a deterministic `_id` (`virtual-<templateId>-<year>-<month>`). These are never persisted unless the user edits one.

---

## Key Fields

| Field | Model | Purpose |
|---|---|---|
| `templateId` | Transaction | Links a real or virtual TX back to its template |
| `frequency` | Transaction | Copied from template on generation; drives the RecurrenceBadge |
| `isVirtual` | Transaction (runtime) | `true` on ghost TXs — not in DB, cannot be edited or deleted |
| `lastGeneratedDate` | RecurringTemplate | High-water mark for generation; prevents duplicates |
| `dayOfMonth` | RecurringTemplate | Target day; clamped to month length at generation time |
| `startDate` / `endDate` | RecurringTemplate | Inclusive generation window |
| `isActive` | RecurringTemplate | `false` = permanently stopped; skipped by generation |

---

## Create Flow

The "Make Recurring" toggle in `CreateTransactionDialog` switches the form into recurring mode (sets `recurrence` to `Monthly` or `Yearly`, shows start/end date fields). On submit it posts to:

```
POST /api/recurring-templates/with-transactions
```

This creates the template and immediately calls `generatePendingTransactions` so transactions for past/current months appear without waiting for the next login.

---

## Edit Flow

Editing a transaction that has a `templateId` shows `EditRecurringTransactionDialog` with two choices. The client branches by whether the transaction is real or a ghost (`isVirtual`).

- **This transaction only** on a real row → `PUT /api/transactions/:id` (normal TX update, template unchanged).
- **This transaction only** on a ghost → `POST /api/recurring-templates/:id/materialize`. The ghost is persisted as a real row carrying `templateId` and the edited fields. `lastGeneratedDate` is intentionally NOT touched, so the cron still fills intervening months on its next run; the cron's per-month dedupe guard prevents it from re-inserting the materialized month.
- **This and future** → `PUT /api/recurring-templates/:id/split`. Works the same way for real and ghost rows because the split endpoint only needs `templateId` (URL) + `fromDate` (body), never a transaction `_id`.
  - Sets `endDate` on the old template to the last day of the month before the TX's date. The old template stays `isActive: true` so its ghosts continue to render for the months it still covers (start → endDate); `buildVirtualTransactions` and `generatePendingTransactions` both honor `endDate`.
  - Creates a new template starting from that month with the updated fields.
  - Deletes all real TXs with the old `templateId` from that month onward.
  - Materializes the boundary month (`fromDate`) immediately as a real row under the new template, via the same `materializeOccurrence` path used by single-occurrence edits. Without this, a future-dated split would leave the edited month as a ghost — `generatePendingTransactions` skips months whose `startMonth > today`, so a brand-new template starting in the future would materialize nothing on its own. The boundary materialization is deduped by `buildVirtualTransactions` (it keys on `(templateId, year, month)`, so the new template's ghost-emission for that month is suppressed) and by the cron-loop guard, so the month renders exactly once.
  - Fires `generatePendingTransactions` async to fill any past-or-current months of the new template that aren't the boundary month.

---

## Delete Flow

Deleting a transaction with a `templateId` shows `DeleteRecurringTransactionDialog`:

- **This transaction only** → `DELETE /api/transactions/:id` (template and other TXs untouched)
- **This and future** → `POST /api/recurring-templates/:id/deactivate-from`
  - If `fromDate` is the same month as the template's `startDate`: sets `isActive: false` and deletes **all** TXs for that template
  - Otherwise: sets `endDate` to the last day of the month before `fromDate`, deletes TXs from `fromDate` onward

Virtual transactions can be edited (they materialize on save — see Edit Flow). Deleting a ghost is not supported; the UI guards delete and shows a snackbar suggesting the user stop the template or wait for the occurrence to land.

---

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/recurring-templates` | List all templates for the user |
| `GET` | `/api/recurring-templates/:id` | Get one template |
| `POST` | `/api/recurring-templates` | Create template only |
| `POST` | `/api/recurring-templates/with-transactions` | Create template + generate TXs immediately |
| `PUT` | `/api/recurring-templates/:id` | Update template fields |
| `PUT` | `/api/recurring-templates/:id/split` | Split template at a date (edit this & future) |
| `POST` | `/api/recurring-templates/:id/materialize` | Persist a single ghost as a real override (this transaction only on a virtual row) |
| `POST` | `/api/recurring-templates/:id/deactivate-from` | Stop template from a date (delete this & future) |
| `DELETE` | `/api/recurring-templates/:id` | Hard-delete template |
