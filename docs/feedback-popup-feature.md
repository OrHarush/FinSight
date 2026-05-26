# Feedback Popup Survey Feature

## Why We Built It

Getting qualitative feedback from real users early is critical for Lyra's product direction. The sidebar "שלח משוב" button exists but relies on users proactively finding and clicking it — most won't. The popup auto-surfaces at the right moment (after the user has enough context to give meaningful feedback) without being intrusive.

---

## When It Triggers

The popup appears **once per user, ever**, when either condition is met first:

| Condition | Signal |
|---|---|
| User has added ≥ 3 transactions | Enough context to have an opinion |
| User has been active on ≥ 2 distinct days | Returned user = retained user |

**Edge case — existing users:** Any user who already had ≥ 3 transactions on the deploy date (`2026-05-26`) is silently auto-marked as seen on their first eligibility check and never sees the popup. Handled at runtime in `getSurveyEligibility` — no migration script needed.

---

## How It Works

### Two Variants

Both variants submit feedback the same way (save to DB + send email). The `variant` field is stored as metadata so you can filter in the DB.

| | Manual (`'manual'`) | Popup (`'popup'`) |
|---|---|---|
| Trigger | User clicks "שלח משוב" in sidebar | Auto-triggered by hook |
| Opener text | None | "איך הולך עם Lyra?" + subline |
| Footer | "בטל" + "צור" (FormDialog default) | "דלג" + "שלח" at 50/50 width |
| Mark seen | Never | On any close: X, דלג, or submit |

### Closing the Popup

All three close paths (X button, דלג, successful submit) call `closeSurvey` from `useFeedbackPopup`, which fires `PATCH /api/feedback/survey-seen` before closing. Once seen, the eligibility endpoint returns `shouldShow: false` forever.

### Seen Flag

Stored as `feedbackSurveySeenAt: Date | null` on the User document (null = not seen). No boolean — seen state is derived as `!!user.feedbackSurveySeenAt`. Survives across devices because it's server-side.

---

## Flow Diagram

```
App loads (AuthenticatedLayout)
  └─ useFeedbackPopup
       └─ GET /api/feedback/survey-eligibility
            ├─ feedbackSurveySeenAt set? → shouldShow: false
            ├─ Pre-deploy user + ≥3 txns? → auto-mark seen → shouldShow: false
            ├─ txCount ≥ 3? → shouldShow: true
            ├─ activeDays ≥ 2? → shouldShow: true
            └─ else → shouldShow: false

shouldShow: true → popup opens

User closes popup (any path)
  └─ PATCH /api/feedback/survey-seen → sets feedbackSurveySeenAt = now

User submits feedback
  └─ POST /api/feedback → saves Feedback doc + sends email
```

---

## Changes Made

### Backend

| File | Change |
|---|---|
| `shared/types/FeedbackCommands.ts` | Added `type?` and `variant?` to `CreateFeedbackCommand` |
| `server/src/models/Feedback.ts` | **New** — Mongoose model: `type`, `message`, `userId`, `variant`, `route`, `createdAt`; indexed on `userId + createdAt` |
| `server/src/repositories/feedbackRepository.ts` | **New** — `insert()` |
| `server/src/models/User.ts` | Added `feedbackSurveySeenAt: Date \| null` (default null) |
| `server/src/repositories/userRepository.ts` | Added `markFeedbackSurveySeen()` |
| `server/src/repositories/dailyActivityRepository.ts` | Added `countByUser()` |
| `server/src/services/feedbackService.ts` | Now persists to DB before emailing; added `getSurveyEligibility()` and `markSurveySeen()` |
| `server/src/controllers/feedbackController.ts` | Added `getFeedbackSurveyEligibility` and `markFeedbackSurveySeen` handlers |
| `server/src/routes/feedbackRoutes.ts` | Added `GET /survey-eligibility` and `PATCH /survey-seen` |

### Frontend

| File | Change |
|---|---|
| `client/src/components/shared/inputs/TypeToggleField/index.tsx` | Added optional `options?: ToggleTypeOption[]` prop; widened value type from `TransactionType` to `string` — existing callers unaffected |
| `client/src/components/features/feedback/FeedbackForm.tsx` | Replaced RHFSelect with TypeToggleField (ChatBubble/BugReport/Lightbulb, purple/red/amber); added `variant` prop — popup shows opener text above toggle |
| `client/src/components/features/feedback/FeedbackDialog.tsx` | Added `variant` prop; popup renders its own `LyraDialog` + form + 50/50 footer (FormDialog untouched) |
| `client/src/hooks/feedback/useFeedbackPopup.ts` | **New** — queries eligibility, opens popup, owns mark-seen call via `useOpen` |
| `client/src/components/shared/layout/AuthenticatedLayout.tsx` | Mounts popup `FeedbackDialog` driven by `useFeedbackPopup` |
| `client/src/constants/Routes.ts` | Added `FEEDBACK_SURVEY_ELIGIBILITY` and `FEEDBACK_SURVEY_SEEN` |
| `client/src/locales/he/common.json` | Added `feedback.toggle.*`, `feedback.popup.*`, `buttons.send` |
| `client/src/locales/en/common.json` | Same |

### Not Touched
- `FormDialog.tsx` — left completely unchanged
- `Settings/index.tsx` — manual FeedbackDialog usage unchanged

---

## Testing

To force the popup open without meeting the eligibility conditions, change line 13 in `useFeedbackPopup.ts`:

```ts
// temporary test — revert before committing
const [isOpen, openSurvey, closeSurveyState] = useOpen(true);
```

Revert to `useOpen()` (no arg, defaults to `false`) when done.
