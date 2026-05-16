# Security Procedure — Lyra

**Last reviewed:** 2026-05-16
**Owner:** Or
**Regulatory framework:** Israeli Privacy Protection Regulations (Data Security), 5777-2017. Lyra is classified as **basic security tier** (רמת אבטחה בסיסית) — single-controller operation, no special-category data, no large-scale processing, no data sales.

This procedure documents the operational security controls actually implemented in the Lyra codebase, plus the procedures the controller follows. It is a companion to `database-definition.md`.

---

## 1. Classification

| Criterion | Result |
|-----------|--------|
| Number of data subjects | < 10,000 (well below the medium-tier threshold) |
| Sensitive-data categories under §7 of the Privacy Protection Law | None. No medical, biometric, criminal, political-opinion, or sexual-orientation data. Financial transaction amounts are user-entered and not bank-sourced. |
| Data sold or transferred to third parties for value | No. |
| Number of personnel with database access | 1 (the controller). |
| Resulting tier | **Basic** (רמת אבטחה בסיסית) per §1 of the 2017 regulations. |

The classification is reassessed at each annual review (§11) and whenever the architecture changes materially.

---

## 2. Access control

| Layer | Mechanism | Implementation |
|-------|-----------|----------------|
| End-user authentication | Google OAuth 2.0 (ID-token flow) | `services/authService.ts → loginWithGoogle`. Tokens are verified against Google using `google-auth-library`'s `OAuth2Client.verifyIdToken`. |
| Session token | JWT (HS256), 90-day expiry, with `issuer` / `audience` claims | Issued in `authService.ts`; verified in `auth/jwt.ts` and `middlewares/authMiddleware.ts`. Stored client-side in `localStorage`. |
| Authorization | Per-request middleware on every `/api/*` route except `/api/auth` and `/api/cron` | `app.ts` mounts `authMiddleware` at `app.use('/api', authMiddleware)`. Admin routes additionally pass through `requireAdmin`. |
| Cron endpoint protection | Shared secret in `X-Cron-Secret` header | `middlewares/requireCronSecret.ts`; secret stored as `CRON_SECRET` env var; called by the external cron scheduler. |
| Database admin access | Single MongoDB Atlas admin user (the controller) | No additional Atlas IAM users. MFA is enabled on the controller's Google account, which is the Atlas login. |
| Application admin role | `user.role = "admin"` enforced via `requireAdmin` middleware | Only the controller's user record holds the admin role in production. |
| Source-code access | Private GitHub repository, single contributor | The repo is not public. |

### Known gap

The local file `Lyra/server/.env.claude` contains live production secrets (Atlas connection string with password, JWT signing key, Gemini API key, Resend API key). This is a remediation item — secrets should be rotated and removed from any file that lives in the working tree, even if `.env.claude` is `.gitignore`-listed. Target: rotate before the next external review.

---

## 3. Authentication

- **Users:** Google OAuth only. No passwords are accepted, stored, or hashed by Lyra. Account compromise risk is delegated to Google's authentication stack (which enforces MFA when the user has it enabled).
- **Backend services:** stateless. Render-to-Atlas authentication uses a username/password pair (the Atlas user) plus TLS — credentials stored only as Render environment variables.
- **CSRF:** N/A — the API is consumed exclusively as a bearer-token API (JWT in `Authorization` header), with same-origin enforcement via CORS allowlist (`config/security.ts → corsConfig`).
- **Dev-bypass:** `loginAsDevUser` exists in `authService.ts` for local development. It is gated on the `DEV_AUTH_BYPASS_EMAIL` environment variable, which is not set in production.

---

## 4. Encryption

| Channel / state | Mechanism |
|-----------------|-----------|
| Browser ⇄ Vercel (frontend) | HTTPS / TLS 1.2+ (terminated by Vercel). HSTS header with `max-age=31536000; includeSubDomains; preload` is configured on the Render backend via Helmet (`config/security.ts → helmetConfig`). |
| Browser ⇄ Render (API) | HTTPS / TLS 1.2+ (terminated by Render). |
| Render ⇄ Atlas | TLS 1.2+ enforced by Atlas; connection string uses `mongodb+srv://`. |
| Vercel ⇄ Google OAuth | HTTPS (Google-enforced). |
| At rest — MongoDB Atlas | AES-256 encryption, provider-managed keys (Atlas default). |
| At rest — Vercel build artifacts and Render container images | Provider-managed encryption (Vercel and Render defaults). |
| Backups | Inherit Atlas at-rest encryption when enabled (currently not enabled — see §6). |

### Known gap

The `config/security.ts → helmetConfig` export (which sets HSTS, CSP, and COEP) is currently **not used**; `app.ts` uses a plain `helmet()` call with only `crossOriginOpenerPolicy` overridden (needed for the Google OAuth popup). HSTS and CSP at the API layer should be enabled by wiring `helmetConfig` in. Static-asset security headers on the Vercel frontend are already in place via `client/vercel.json`.

---

## 5. Rate limiting

Implemented with `express-rate-limit` in `config/rateLimiters.ts`:

| Limiter | Window | Limit | Mounted? |
|---------|--------|-------|----------|
| `authLimiter` | 15 min | 100 req per IP | **Yes** — `app.ts` mounts it on `/api/auth` (covers Google login + dev-bypass). |
| `generalLimiter` | 15 min | 300 req per IP | **No** — defined but not mounted anywhere. Planned. |
| `chatLimiter` | 1 min | 20 req per IP | **No** — defined but not mounted on `/api/chat`. Planned. |
| `exportLimiter` | 1 hour | 5 req per authenticated user | **Yes** — mounted on `GET /api/users/me/export` (read-heavy 7-collection scan, response can be megabytes). Keyed by `req.userId`. |

Express is configured with `app.set('trust proxy', 1)` so the limiter sees the true client IP from Render's edge proxy. IPs seen by the limiter are not persisted — they live only in the in-memory limiter store.

### Planned

Mount `generalLimiter` globally on `/api` (after auth middleware) and `chatLimiter` on `/api/chat`. Target: next sprint.

---

## 6. Logging

### What is logged

- **Error log** — `middlewares/errorHandlerMiddleware.ts` writes one JSON line per error to `console.error`. Fields: `timestamp`, `level`, `requestId`, `userId` (if authenticated), `method`, `path`, `statusCode`, `message`, `isOperational`, and for 5xx errors also `stack`. These lines are captured by Render's log stream.
- **Sign-in events** — `adminService.recordLoginEvent` writes a `UserActivityEvent` document to MongoDB on every successful login.
- **Analytics events** — only for users with `analyticsConsent = "accepted"`. Written to `analytics_events`. See `database-definition.md` §4.4.
- **Application stdout** — narrow operational messages (e.g., balance-sync failures) are written via `console.error` and captured by Render.

### What is never logged

- IP addresses (Render's HTTP access log is provider-side; the application code does not write IPs anywhere except `consentIp` at the moment of consent acceptance).
- Request bodies. The error logger does not include the request body or query string.
- Authentication tokens (JWT, Google ID token) — neither is logged anywhere.
- Passwords — none are processed.
- Financial values — transaction amounts, account balances, and budget limits are never written to logs.

### Retention

Render log retention follows the Render plan default (currently 7 days for the free/starter tier). MongoDB-stored event documents follow §7 of `database-definition.md`.

---

## 7. Backup policy

### Current state

- The MongoDB Atlas cluster is on the **M0 free shared tier**, which does **not** include continuous cloud backups or point-in-time recovery.
- No application-level backup job is in place.
- Recovery from accidental deletion at present relies on the deletion cascade being correct (synchronous, single-transaction) plus manual export by the controller.

### Planned

- Upgrade to Atlas **M2** (dedicated, paid) to enable automated continuous backups with a 7-day retention window and point-in-time restore. Target: before reaching 500 active users or before the next annual review, whichever comes first.
- Document a quarterly restore drill once continuous backups are in place.

This gap is acknowledged. For the current scale (small early-stage user base) and basic-tier classification, the absence of automated backups does not constitute non-compliance, but it is a known operational risk and the controller treats the M2 upgrade as a priority.

---

## 8. Incident response

Lyra is a single-operator product. The incident-response procedure is correspondingly lightweight but explicit.

| Phase | Action |
|-------|--------|
| **Detect** | Sources: Render error-log alerts (configured to email the controller on 5xx spikes), MongoDB Atlas alerts (network unauthorized access, unusual query volume), reports from users via in-app feedback or email. |
| **Contain** | (1) Identify scope — which users, which collections. (2) If a credential leak is suspected: rotate the affected secret (`CRON_SECRET`, `JWT_SECRET`, Atlas password, Gemini key, Resend key). (3) If a code-path bug is leaking data: deploy a hotfix or roll back the affected deployment via Render. (4) If Atlas is the vector: revoke the Atlas user and create a new one. |
| **Eradicate** | Patch the underlying defect. Add a test that exercises the regression. Land via the normal PR + deploy flow. |
| **Recover** | Verify service health (`/health` endpoint, smoke-test sign-in, smoke-test transaction CRUD). If data was lost, restore from the most recent Atlas backup (once §7 is in place) or from controller-side manual export. |
| **Notify users** | If personal data was actually accessed, used, or destroyed without authorization, notify affected users by email within 72 hours of confirming the incident. Notice includes: nature of the incident, data categories involved, mitigation steps already taken, and recommendations to the user. |
| **Notify authority** | Under Amendment 13 to the Israeli Privacy Protection Law (effective August 2025), report to the Israeli Privacy Protection Authority within the regulatory window when the incident meets the reporting threshold. The controller's default reading is to err on the side of reporting — the cost of a precautionary report is low. The authority's [breach notification form](https://www.gov.il/he/departments/privacy_protection_authority) is the channel. |
| **Post-mortem** | Within 14 days of recovery, the controller writes a short post-mortem (root cause, timeline, mitigations, follow-ups) into `LyraVault/bugs-fixed.md`. |

There is no on-call rotation — the controller is sole responder. Target initial response time: 4 hours during waking hours.

---

## 9. Vendor management

See `database-definition.md` §9 for the full table. Summary of the security stance per vendor:

| Vendor | Security relationship |
|--------|----------------------|
| MongoDB Atlas | Primary data processor. SOC 2 Type II, ISO 27001, GDPR DPA available via Atlas terms. EU storage region. |
| Vercel | Frontend host. SOC 2, ISO 27001. Application has no DB credentials in Vercel — frontend is pure static + client-side JS. |
| Render | Backend host. Holds production secrets in env-var store. SOC 2 Type II. US region for free tier; an EU region migration is a possible future change. |
| Google (OAuth) | Identity provider. Security is Google's responsibility; Lyra only verifies ID tokens. |
| Google (Gemini API) | LLM. Subject to Google's API terms. The controller has reviewed Gemini's data-use terms — API inputs are not used to train consumer Gemini models when called via the paid API. |
| Resend | Transactional email. Only used to send in-app feedback to the controller's mailbox — does not process end-user PII in volume. |

Vendor changes (adding, removing, or migrating a major subprocessor) are treated as material architecture changes and trigger a review (§11).

---

## 10. Data deletion procedure

User-initiated deletion runs through `userService.deleteUserCompletely(userId)` in a single MongoDB session/transaction. The cascade performs **hard deletes** for financial / personal collections and **anonymization** for audit-bearing event streams that the Privacy Policy carves out under legitimate interest (§8).

### Hard deletes (executed in order inside the transaction)

1. `transactions` (where `userId = X`)
2. `recurringTemplates`
3. `budgets`
4. `goals`
5. `accounts`
6. `categories`
7. `payment_methods`
8. `debugSnapshots`

### Anonymizations (executed in the same transaction, before the `users` doc is deleted)

9. `user_activity_events` — `userId` set to `null`, `userName` cleared. Rows remain for aggregate metrics (login counts, active-user trends) and to satisfy the 7-year security-audit retention window. The schema makes both fields optional to keep the row coherent after scrubbing.
10. `analytics_events` — `userName` and `userAvatar` cleared on all matching rows. Matched by `userName` only (no `userId` on this collection — a follow-up will add one); false positives are accepted because they lean toward more privacy. Rows continue to age out via the 12-month TTL.

### Final step

11. The `users` document itself.

If any step throws, the entire transaction aborts and no partial deletion or anonymization is persisted. The `users` doc is intentionally last so a mid-cascade failure leaves a recoverable state (the user still exists and the operation is idempotent on retry).

### Side-effects outside the transaction

- A `DeletionFeedback` document is written **before** the transaction starts (anonymous — no `userId`). If the user is already gone, the function bails early without writing feedback.
- A pre-transaction `analyticsService.captureUserSnapshot(userId)` captures name + avatar so that a final `user_deleted` analytics event can be emitted post-commit using the snapshot (the user doc no longer exists at that point).

### Post-deletion timeline

- **Immediate:** all primary collections in the cascade are purged or anonymized inside a single MongoDB transaction.
- **Within 30 days:** any residual copy in Atlas's backup snapshots ages out of the rolling backup window (once §7 is in place). Until then, the 30-day commitment is met by virtue of there being no backups at all.

### Hard-delete vs. soft-delete

All non-event collections are hard deletes. Lyra does not implement soft-delete or "deactivated account" states. The two event collections (`user_activity_events`, `analytics_events`) are anonymized rather than deleted by design — see the rationale above.

---

## 11. Review cadence

This document and `database-definition.md` are reviewed:

- **Annually**, at minimum, on the anniversary of the previous review date (next: 2027-05-16).
- **Out-of-cycle**, whenever any of the following occur:
  - A new processor or subprocessor is added.
  - A new collection or significant new field is introduced to the schema.
  - The authentication or session model changes.
  - A material security incident is handled (per §8).
  - A regulatory change to the 2017 Data Security Regulations or to the Privacy Protection Law is enacted.

Reviews are conducted by the controller. The output of each review is an updated "Last reviewed" date at the top of each document and, where relevant, a delta entry in `LyraVault/pending-work.md`.
