# Lyra — Compliance Status & Gap Analysis

**Date:** May 16, 2026
**Scope:** Israeli Privacy Protection Law + Amendment 13 (Aug 14, 2025) + 2017 Security Regulations + adjacent laws (Consumer, Computer, Accessibility, Spam, Open Banking).
**Tier:** "מאגר המנוהל על ידי יחיד" (single-operator database). ~100 users, no revenue, no bank connection, no data resale, no direct marketing.

The full legal reasoning lives in `preplexity_market_research.md`. This doc is the operational view: what's done, what's missing, in what order.

---

## TL;DR

We are **mostly compliant** for our current scale. There are **6 mandatory gaps** to close, **5 recommended improvements**, and a clear "later" list for when we grow past 10K users or change business model.

The single highest-priority gap is the one with a written promise to users that we don't yet keep: **AnalyticsEvent TTL.** The privacy policy promises 12-month auto-expiry. The code has no TTL index. Everything else is paperwork or polish.

---

## What's already done ✅

| # | Item | Where it lives |
|---|------|----------------|
| 1 | Privacy policy (EN + HE) covering data types, purposes, retention, rights, cookies, third parties, age | `client/src/locales/{en,he}/privacyPolicy.json` |
| 2 | Terms of Service (EN + HE) | `client/src/locales/{en,he}/termsOfService.json` |
| 3 | Accessibility statement (EN + HE) | `client/src/locales/{en,he}/accessibility.json` |
| 4 | Cookie consent banner with opt-in for analytics | client cookie banner |
| 5 | Google OAuth (no password storage) | `authService.ts` |
| 6 | TLS in transit, MongoDB Atlas encryption at rest | infra (Atlas eu-central-1) |
| 7 | In-app account deletion with cascade (Transactions, Accounts, Categories, PaymentMethods, Budgets, User) | `userService.deleteUserCompletely` |
| 8 | Internal Database Definition Document | `docs/compliance/database-definition.md` |
| 9 | Internal Security Procedure | `docs/compliance/security-procedure.md` |
| 10 | Consent proof (IP + UserAgent stored once on terms acceptance) | `User.consentIp`, `User.consentUserAgent` |
| 11 | Rate limiter on `/api/auth` | `app.ts` mounts `authLimiter` |
| 12 | Helmet security headers + CORS allowlist | `app.ts`, `config/security.ts` |
| 13 | EU data residency (MongoDB Atlas Frankfurt) | infra |
| 14 | Subprocessors documented (Atlas, Vercel, Render, Google, Resend, Gemini) | `security-procedure.md` |

---

## What's required but missing ❌ — MUST DO

Priority order. Each item is mandatory either by law or by an existing promise we made to users.

### 1. AnalyticsEvent TTL index — **broken promise, highest priority**

**The gap.** Privacy policy promises analytics events expire after 12 months. There is no TTL index on the `AnalyticsEvent` collection. Events accumulate forever.

**Why it's #1.** This is the only place where the product *materially contradicts* what we tell users. Every other gap is "we should also do X." This one is "we said we do X and we don't."

**Fix.** Add a TTL index on `AnalyticsEvent.createdAt` with `expireAfterSeconds: 60 * 60 * 24 * 365`. One migration line, one model change.

---

### 2. Complete the deletion cascade

**The gap.** `deleteUserCompletely` currently removes: Transactions, Accounts, Categories, PaymentMethods, Budgets, User. Missing collections:

- `Goal` (Financial Goals feature)
- `RecurringTemplate`
- `UserActivityEvent` (login records — debatable, keeps independent audit trail)
- `DebugSnapshot` (if present)
- `AnalyticsEvent` — debatable: events are name+avatar only, not linked by userId; arguably orphan-safe, but should at least be reviewed

**Why it matters.** Amendment 13's deletion right is broader than pre-2025 — it covers data no longer needed for original purpose, not just incorrect data. A user requesting deletion has a statutory right to *full* removal. Today they get partial removal.

**Fix.** Extend the transaction in `deleteUserCompletely` to include the missing collections. Document the policy on `UserActivityEvent` (keep N days for security audit?) in the security procedure.

---

### 3. Notice at point of collection (סעיף 11)

**The gap.** The Privacy Authority's 2022 position document is explicit: a privacy policy page **does not replace** specific notice at each collection touchpoint. We have a policy page, but no short notice text next to:

- Google OAuth sign-in button
- CSV upload zone in the import wizard
- Analytics opt-in toggle in the cookie banner / Settings → Privacy & Data

**Fix.** Short Hebrew text under each: what's collected, why, link to policy. Three small i18n additions, no architecture change.

Example (under Google sign-in):
> בהתחברות תיאסף הכתובת והתמונה שלך מ-Google לצורך זיהוי חשבון. למידע נוסף — מדיניות פרטיות.

Example (above CSV dropzone):
> הקובץ מנותח בדפדפן ובשרת לצורך ייבוא בלבד. רק התנועות שתאשר נשמרות. הקובץ עצמו לא נשמר אצלנו.

Example (under analytics toggle):
> אירועי שימוש (לחיצות, צפיות במסך) יישמרו לצד שם המשתמש והאווטאר במשך עד 12 חודשים.

---

### 4. DPAs / written processor commitments

**The gap.** Regulation 2(4) + 3 of the cross-border transfer regulations require a **written commitment** from each processor that they meet Israeli-equivalent standards. We rely on default ToS for: MongoDB Atlas, Vercel, Render, Resend, Google OAuth, Gemini API.

**Most of these have a DPA available** — they just need to be reviewed/signed and a copy linked in `security-procedure.md`.

**Fix.**
- MongoDB Atlas: DPA available in Atlas console → Security → Legal
- Vercel: DPA in dashboard → Settings → Privacy
- Render: DPA at render.com/dpa
- Resend: DPA on request via support
- Google: Google Cloud DPA covers OAuth + Gemini

For each, save a PDF copy in `docs/compliance/dpa/` and reference in the security procedure.

---

### 5. Data export endpoint (data portability — Amendment 13)

**The gap.** Amendment 13 introduced a right to data portability — receive personal data in a structured, machine-readable format. We have no such endpoint.

**Fix.** `GET /api/users/me/export` returns a single JSON file with: user profile, transactions, accounts, categories, payment methods, budgets, goals, recurring templates. Settings → Privacy & Data gets a "Download my data" button.

Reasonably small effort: it's a fan-out over the existing repositories.

---

### 6. Update internal compliance docs to reflect Amendment 13

**The gap.** `database-definition.md` and `security-procedure.md` exist but pre-date the Aug 2025 amendment. They should reference:

- Category "מידע בעל רגישות מיוחדת" (financial activity = sensitive)
- Tier classification ("מאגר המנוהל על ידי יחיד")
- 7-year statute of limitations → retain compliance records 7 years
- Updated subprocessor list with DPA status per processor

**Fix.** One pass through both docs, ~30 min.

---

## What we should do soon ⚠️ — SHOULD DO

Strong recommendations. Low-to-medium effort, meaningful risk reduction.

### A. Atlas M2 upgrade for automated backups

M0 has no backups. Regulation 19 of the 2017 Security Regulations requires backup procedures. We have nothing. M2 = $9/month, daily snapshots, point-in-time recovery. Document the recovery procedure in `security-procedure.md`.

### B. Mount or remove the dead rate limiters

`generalLimiter` and `chatLimiter` are defined in `config/rateLimiters.ts` but never mounted in `app.ts`. Decision needed:
- Mount `generalLimiter` on `/api`
- Mount `chatLimiter` on `/api/chat`
- Or delete them and document the decision

Right now they're dead code that looks like coverage we don't have.

### C. Lightweight risk register

A markdown table: threat × mitigation × owner × last-reviewed. Maybe 10 rows (data leak, admin account compromise, DB exposure, backup failure, supply-chain attack on a dependency, etc.). Sits in `docs/compliance/risk-register.md`. Doesn't need to be heavyweight — it just needs to exist.

### D. Admin access logging retention

Logs of admin DB/backend access kept for 12–24 months in cloud logs (Render + Atlas). Currently nothing intentional.

### E. Incident Response section in security procedure

We have a procedure file, but no explicit IR section: detection → containment → forensics → notification thresholds → user-facing comms template. Even a 1-page version is enough.

---

## What's optional / for later 🔮

Triggers, not deadlines.

| Trigger | What it activates |
|---------|-------------------|
| >10 admin users on Atlas/Render/Vercel | Move from "single-operator" to "basic security" tier; add formal access reviews |
| >10,000 users with financial data | Move to **medium** security tier: automated access logging (Reg. 10), formal pen-tests (Reg. 15), incident reporting to Privacy Authority (Reg. 11(d)) |
| >100,000 users with financial data | Section 8(ג1) notification to Authority within 30 days; likely DPO appointment |
| Add real Open Banking integration | Financial Information Service License under תשפ״ב-2021; significantly heavier regulation (BoI / Capital Markets Authority) |
| Start marketing emails / SMS | Spam Law (סעיף 30א) opt-in collection, unsubscribe in every message, evidence retention |
| Start charging users | Open עוסק פטור file with tax authority (or incorporate as Ltd) before crossing ~₪122K annual revenue |
| Add 2nd+ team member | Formal DPO consideration if data sensitivity grows; access role separation; documented onboarding/offboarding |

---

## Enforcement reality check

The Privacy Authority's published enforcement actions over 2019–2024 target: large fintechs, insurance companies, public bodies, big e-commerce. No public case against a ~100-user solo-founder app. Penalties typically scale with size.

That said, Amendment 13 raised the administrative fine ceiling significantly and **expanded** the no-proof-of-damage civil claim under Section 29א to more grounds. A single motivated user can sue for up to ₪50K per incident without proving damage.

Bottom line: closing the 6 mandatory gaps takes us from "vulnerable to anyone who looks closely" to "defensible at our scale." That's the bar we want to clear.

---

## Sequenced execution plan

**Week 1 (mandatory gaps, mechanical):**
1. AnalyticsEvent TTL index (1 hr)
2. Deletion cascade completion (2 hr)
3. Notice strings at the 3 collection points (2 hr, mostly i18n)
4. Update `database-definition.md` + `security-procedure.md` to Amendment 13 (1 hr)

**Week 2 (mandatory gaps, paperwork + small features):**
5. Collect and file DPAs from each subprocessor (3 hr, mostly waiting)
6. Data export endpoint + Settings UI button (1 day)

**Week 3+ (recommended):**
7. Atlas M2 upgrade + backup procedure documented (1 hr work, +$9/mo)
8. Mount or remove rate limiters (15 min)
9. Risk register markdown (1 hr)
10. IR section + admin log retention (2 hr)

After this is done, the **public-facing security doc** (the one to send when a Facebook user asks "is my data safe") becomes truthful end-to-end. Until then, that doc would have to disclaim some of these gaps, which defeats the purpose.

---

## What this doc deliberately doesn't cover

- **DPO appointment** — not required at our scale per the Authority's draft guidance on Section 17ב1.
- **Database registration (Section 8(ג))** — not required; we don't fit any of the three triggers.
- **Notification to Authority (Section 8(ג1))** — not required; threshold is 100K data subjects with sensitive data.
- **Pen-testing (Reg. 15)** — formal requirement starts at medium tier. We should still do basic security review periodically; not a compliance gap.
- **Financial supervision (ISA / BoI)** — we're not a regulated financial service. Keep messaging as "tracking tool," not "advice."

These are all flagged for revisit when we cross the relevant scale or model thresholds (see Optional / Later section).
