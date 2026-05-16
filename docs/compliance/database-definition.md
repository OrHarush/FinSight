# Database Definition — Lyra

**Last reviewed:** 2026-05-16
**Owner:** Or
**Regulatory framework:** Israeli Privacy Protection Regulations (Data Security), 5777-2017, post-Amendment 13. Lyra is registered under the **basic security tier** (רמת אבטחה בסיסית).

This document defines the Lyra production database for the purposes of the data-security regulations referenced above. It is maintained alongside the codebase so it stays grounded in what the system actually does.

---

## 1. Controller identity

| Field | Value |
|-------|-------|
| Controller | Or Harush, individual operator |
| Country | Israel |
| Capacity | Sole proprietor — Lyra is operated as an early-stage independent product. There are no employees, contractors, or co-controllers. |
| Contact | orharush24@gmail.com |

---

## 2. Database identity and purpose

| Field | Value |
|-------|-------|
| Database name | `lyra` (single logical database on a MongoDB Atlas cluster) |
| Cluster | MongoDB Atlas, free shared-tier cluster |
| Region | EU (`eu-central-1`, Frankfurt, Germany) |
| Purpose | Personal-finance tracking — store user-entered income, expenses, transfers, budgets, goals, recurring templates, and the authentication record required to bind that data to a user account. |
| Scope of processing | Operational use only. Data is not shared, sold, rented, or used for any secondary purpose (no model training, no marketing enrichment, no third-party analytics resale). |

---

## 3. Categories of data subjects

End users of the Lyra web application. Practical profile:

- Individuals aged 16 or older (enforced contractually via the Terms of Service; not technically verified).
- Primarily Israeli residents (Hebrew is the primary UI language; default display currency is ILS), but the application is reachable globally and may have non-Israeli users.
- Each data subject is an account holder. There are no "data subject by association" categories — Lyra does not store information about third parties (e.g., people the user owes money to).

Lyra does not knowingly collect data from anyone under 16.

---

## 4. Categories of data stored

All data is held in MongoDB collections. The list below reflects the actual Mongoose models in `Lyra/server/src/models/`.

### 4.1 Account / identity data (collection: `users`)

Sourced from Google OAuth and from in-app actions. Fields on the `User` model:

- `email` (from Google)
- `name` (from Google)
- `picture` (URL to Google-hosted avatar, optional)
- `role` (enum: `USER` / admin role — admin role is held only by the controller)
- `providers[]` — array of `{ provider, providerId }`; currently `provider = "google"`, `providerId` is the Google `sub` claim
- `displayCurrency` (default `"ILS"`)
- `hasCompletedOnboarding`, `activatedAt`, `lastActiveAt`, `lastLoginAt`, `totalTransactions` — operational metadata
- `createdAt`, `updatedAt` — Mongoose timestamps

### 4.2 Consent record (collection: `users`, embedded fields)

Stored on the same `User` document. Used as proof of consent for Terms of Service and Privacy Policy acceptance:

- `acceptedTermsAt` (Date)
- `acceptedPrivacyAt` (Date)
- `consentVersion` (string — the policy version the user accepted; current value `2025-10-17`)
- `consentLocale` (`he` or `en`)
- `consentIp` — IP address **at the moment of consent acceptance only**
- `consentUserAgent` — browser user-agent **at the moment of consent acceptance only**
- `analyticsConsent` (enum: `pending` / `accepted` / `rejected`)
- `analyticsConsentUpdatedAt` (Date)

IP address and user-agent are not captured anywhere else in the application.

### 4.3 Financial data (manually entered by the user)

| Collection | Model | Contents |
|------------|-------|----------|
| `accounts` | `Account` | Bank/cash account names, balances (integer cents), institution, last-4 of account number, currency, checkpoint balance |
| `transactions` | `Transaction` | User-entered income, expense, and transfer records — name, note, amount (cents), date, category ref, payment-method ref, account refs |
| `recurringTemplates` | `RecurringTemplate` | Templates that auto-generate recurring transactions |
| `categories` | `Category` | User-defined and default categories — name, type (Income/Expense/Savings), color, icon |
| `payment_methods` | `PaymentMethod` | User payment methods — name, type, optional last-4 digits, billing day |
| `budgets` | `Budgets` | Monthly category limits — `{ year, month, categoryId, limit }` |
| `goals` | `Goal` | Savings goals — name, target amount, target date, expected return, status |

No banking credentials, no card PANs, no card CVVs, no full account numbers — only the last four digits (optional, user-entered) for the user's own reference.

### 4.4 Technical / operational data

| Collection | Model | Contents |
|------------|-------|----------|
| `user_activity_events` | `UserActivityEvent` | Sign-in events — `userId`, denormalized `userName`, `type: "LOGIN"`, `occurredAt`. Used for security audit. |
| `analytics_events` | `AnalyticsEvent` | Product-usage events (e.g., `transaction_created`, `goal_created`). Each event stores `event`, `userName`, `userAvatar`, `createdAt`. Recorded only for users with `analyticsConsent = "accepted"`. |
| `deletion_feedback` | `DeletionFeedback` | Anonymous post-deletion survey — `reason`, `comment`, `transactionCount`, `daysSinceSignup`, `hadCompletedOnboarding`, `locale`. Contains **no userId** and no identifying fields. |
| `debugSnapshots` | `DebugSnapshot` | Diagnostic snapshots created on demand during recurring-template generation debugging — references to user account balances and template state. Operational only. |

### 4.5 Data Lyra does **not** store

- Passwords (Google OAuth is the only authentication method).
- Bank login credentials, open-banking tokens, or any data fetched from financial institutions — Lyra has no integration with banks.
- Payment card primary account numbers (PANs), expiry dates, or CVVs.
- General-purpose IP-address logs or request logs containing user IPs.
- Browsing history, location, contacts, device identifiers, or any data outside the categories above.

---

## 5. Data sources

| Source | What enters the database |
|--------|--------------------------|
| User input (web form) | All financial data — every transaction, account, category, budget, goal, recurring template is manually typed by the user. |
| Google OAuth | Account creation — `email`, `name`, `picture`, Google `sub`. Lyra calls Google's token-verification endpoint via `google-auth-library`; no Google API beyond ID-token verification is used. |
| CSV import (transient) | The user can upload a CSV of transactions. The file is parsed in-process and the resulting transaction documents are inserted into `transactions`. The original CSV file is **not stored** — Lyra has no file storage subsystem (no S3, no Vercel Blob). |
| Consent ceremony | At the moment the user accepts the Terms + Privacy Policy, the request IP and User-Agent are captured by the consent endpoint and stored on the `User` document (see §4.2). |

Lyra does not enrich, purchase, or import user data from any other source.

---

## 6. Storage location

- **Primary store:** MongoDB Atlas, shared-tier cluster `lyra`, region `eu-central-1` (Frankfurt, Germany).
- **At-rest encryption:** enabled by default on MongoDB Atlas (AES-256, provider-managed keys).
- **Backups:** see `security-procedure.md` §6. The free-tier cluster does not include continuous backups; an upgrade to a paid tier with automated backups is planned.
- **Application servers:** stateless. The Express backend on Render and the React frontend on Vercel hold no persistent data — they read from and write to Atlas.

---

## 7. Retention periods

| Data | Retention |
|------|-----------|
| Active user account + all linked financial data (accounts, transactions, categories, payment methods, budgets) | Retained for as long as the user account exists. |
| All of the above, post-deletion | Permanently removed from MongoDB within 30 days of in-app account deletion. The deletion cascade itself is synchronous; the 30-day window covers backup rotation. See `security-procedure.md` §10. |
| `consentIp` / `consentUserAgent` | Same lifecycle as the user account — deleted with the user. |
| `user_activity_events` (sign-in events) | Currently retained indefinitely. A 12-month TTL is a **planned** change (see §11). |
| `analytics_events` | The Privacy Policy commits to 12-month auto-expiry via a MongoDB TTL index. The TTL index is **not yet deployed** — this is a known gap, tracked as a planned change (see §11). Events are retained until the TTL is enabled. |
| `deletion_feedback` | Retained indefinitely. Contains no identifying fields. |
| `debugSnapshots` | Retained until manually purged. Operational only. |

---

## 8. Cross-border transfer

- The database resides in Germany (EU member state), under GDPR jurisdiction.
- Transfer from Israel (controller location) to Germany is permitted under §36(1)(2) of the Israeli Privacy Protection Regulations: Germany is on the EU adequacy list for data-protection purposes.
- Application requests originate from Render (US region — see §9) and Vercel (global edge); these are processing locations, not storage locations. Atlas connections are TLS-encrypted.

---

## 9. Processors and subprocessors

| Vendor | Role | Jurisdiction | Data processed |
|--------|------|--------------|----------------|
| MongoDB Atlas (MongoDB, Inc.) | Database hosting (primary processor) | Germany (storage); US (corporate) | All collections listed in §4. DPA in place via Atlas terms. |
| Vercel Inc. | Frontend hosting + edge CDN + Vercel Analytics (only if user opted in) | US (corporate); global edge network | Static assets, page-view metadata when consented. No application database access. |
| Render Inc. | Backend (Node.js/Express) hosting | US (Oregon — Render free-tier default) | Stateless request processing. Holds JWT signing secret and Atlas connection string in environment variables. |
| Google LLC | OAuth identity provider (ID-token verification) | US / global | OAuth `sub`, email, name, profile picture URL. Google does not receive any financial data. |
| Resend (Resend, Inc.) | Transactional email — only used to deliver in-app feedback to the controller | US | Feedback subject + body when a user submits feedback. No bulk email, no marketing. |
| Google (Gemini API) | LLM provider for the in-app chat assistant | US / global | User chat messages + Lyra-tool-formatted financial summaries sent at the user's explicit request. Subject to Google's API terms. |

There are no sub-subprocessors beyond what these vendors disclose in their own terms.

### Data Processing Agreements

| Subprocessor | Role | DPA |
|---|---|---|
| MongoDB Atlas | Database (EU/Frankfurt) | https://www.mongodb.com/legal/dpa |
| Vercel | Frontend hosting | https://vercel.com/legal/dpa |
| Render | Backend hosting | https://render.com/dpa |
| Resend | Email | https://resend.com/legal/dpa |
| Google (OAuth + Gemini) | Auth + AI | https://cloud.google.com/terms/data-processing-addendum |

---

## 10. Access controls

- **Administrative database access:** only the controller (Or). MongoDB Atlas account is the single admin; no other Atlas users exist.
- **Application-level admin role:** the `users.role` field can be `admin`. In production, only the controller's account holds this role. The role gates `/api/admin/*` routes via `requireAdmin` middleware.
- **Production secrets** (Atlas connection string, JWT signing key, Gemini key, Resend key) live only in the Render environment-variable store and in the controller's local `.env` files. They are not committed to git (see `security-procedure.md` §2 for the current gap on this).
- **No third-party operational access.** No on-call vendor, no managed-services provider, no contractor has access to the database.

---

## 11. Data-subject rights mechanisms

| Right | Mechanism |
|-------|-----------|
| Right of access | The application UI itself is the access mechanism — the user sees their full dataset on every page. A formal data-export endpoint is **planned** (not yet implemented). |
| Right to rectify | In-app editing on every record (transactions, accounts, categories, budgets, goals, etc.). |
| Right to erase | In-app account deletion (Settings → Privacy & Data → Delete Account). Triggers `deleteUserCompletely` in `userService.ts`. |
| Right to restrict processing | Analytics consent toggle in Settings → Privacy & Data. Setting it to `rejected` immediately stops new analytics events and pauses Vercel Analytics injection. |
| Right to portability | Not yet implemented. A JSON/CSV export endpoint is **planned**. |
| Right to object | Same toggle as above for analytics. For all other processing, the user can delete the account. |
| Contact channel | orharush24@gmail.com — replies handled by the controller within a reasonable time (target: 14 days). |

---

## 12. Planned changes (compliance gaps tracked here)

These items are disclosed for transparency. None affect the regulatory tier (basic security) but they should be closed in the near term:

1. **AnalyticsEvent TTL index** — add `{ expireAfterSeconds: 31_536_000 }` to align actual retention with the 12-month Privacy Policy commitment.
2. **UserActivityEvent TTL index** — add a 12-month TTL to bound retention of sign-in events.
3. **Extend deletion cascade** — `deleteUserCompletely` currently removes transactions, accounts, categories, payment methods, budgets, and the user record. It does not currently remove the user's goals, recurring templates, sign-in event history, or debug snapshots. These should be added to the cascade.
4. **Data-export endpoint** — implement a one-click JSON export for the right-of-portability obligation.
5. **Atlas paid tier** — migrate from M0 (shared, no automated backups) to M2 or higher for continuous backups and audit logging.
6. **Remove live secrets from `.env.claude`** — the local file currently in the repo working tree contains real production credentials; rotate and store only in Render's vault.
