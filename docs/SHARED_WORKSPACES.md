# Shared Workspaces — Flows and Lifecycle

Developer reference for the non-obvious flows. The high-level domain doc lives at [`LyraVault/domains/workspaces.md`](../../LyraVault/domains/workspaces.md). This file is the deeper "what actually happens when X" reference for the membership and deletion paths, since those are easy to get wrong.

---

## Workspace context resolution (every request)

Order of operations on every authenticated API call:

```
authMiddleware              → sets req.userId from the JWT
workspaceContextMiddleware  → calls resolveWorkspaceForRequest(req.userId)
                              ├── reads user.activeWorkspaceId
                              ├── verifies isUserMemberOf(userId, activeWorkspaceId)
                              ├── if stale → falls back to personal workspace + writes back
                              └── sets req.workspaceId
controller                  → delegates to service with req.userId AND req.workspaceId
service                     → never trusts a workspaceId from req.body/req.params
repository                  → filters every read/write by workspaceId
```

**Why this matters.** `User.activeWorkspaceId` can drift: a member is removed but their stale pointer remains; a workspace is cascade-deleted but the user's pointer hangs. The middleware re-verifies membership on every request, so the worst case is a transparent fallback to personal — not a data leak.

Non-HTTP code paths (cron jobs, MCP, chat, import, balance sync on login, user-level data export) call `getActiveWorkspaceIdOrThrow(userId)` instead. That function delegates to the same `resolveWorkspaceForRequest`, so it inherits the membership re-check.

---

## Atomicity model

Every destructive or multi-write workspace operation runs inside a `mongoose.startSession()` / `startTransaction()`. Repositories accept an optional `session?: ClientSession` and pass it to mongoose. The pattern:

```ts
const session = await mongoose.startSession();
session.startTransaction();
try {
  // ... writes pass `session` ...
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  await session.endSession();
}
```

The atomic operations are:
- **Signup**: User insert + Workspace + WorkspaceMember + activeWorkspaceId + default categories/payment-methods/account.
- **Create shared workspace**: Workspace + owner WorkspaceMember + defaults for the creator.
- **Leave workspace**: ownership transfer (if needed) + member-row removal OR cascade-delete-everything + activeWorkspaceId reset.
- **Remove member**: target's member-row removal + activeWorkspaceId reset. Email is sent **after** commit (best-effort).
- **Account deletion**: per-workspace leave-or-cascade for every membership + user-level anonymizations + user document deletion.
- **Cascade deletion**: every scoped collection for that workspaceId + members + invitations + workspace doc itself.

Analytics events (`workspace_created`, `invitation_sent`, etc.) fire **after commit** via `void track(...).catch()`. A failed tracking call can never roll back the user-facing operation.

---

## Cascade deletion

`deleteWorkspaceCompletely(workspaceId, session)` in [`workspaceLifecycleService.ts`](../server/src/services/workspaceLifecycleService.ts). Single function, called from two places. Order matters because invitations and members reference the workspace; data references the workspace too but has no foreign-key constraint.

```
transactions          ← deleteMany({ workspaceId })
recurring_templates   ← deleteMany({ workspaceId })
budgets               ← deleteMany({ workspaceId })
goals                 ← deleteMany({ workspaceId })
accounts              ← deleteMany({ workspaceId })
categories            ← deleteMany({ workspaceId })
payment_methods       ← deleteMany({ workspaceId })
workspace_invitations ← deleteMany({ workspaceId })     all statuses, audit too
workspace_members     ← deleteMany({ workspaceId })
workspaces            ← deleteOne({ _id: workspaceId })
```

All inside the caller's session. If any step throws, every prior delete in the same session rolls back.

Two call sites:
- `leaveSharedWorkspaceTx` when the leaving member is the last one.
- `deleteUserCompletely` for the user's personal workspace and for any shared workspace where they're the last member.

---

## Leave workspace flow

```
POST /api/workspaces/:id/leave   (authed)
  ↓
sharedWorkspaceService.leaveWorkspace(userId, workspaceId)
  ├── reject 400 if workspace.type === 'personal'
  ├── startSession() + startTransaction()
  ├── leaveSharedWorkspaceTx(userId, workspaceId, session):
  │     ├── load caller's WorkspaceMember
  │     ├── load all WorkspaceMembers in the workspace
  │     ├── if (caller.role === 'owner' && otherMembers.length > 0):
  │     │     → transfer ownership to the earliest-joined other member
  │     │       (updateRole(workspaceId, successor.userId, 'owner', session))
  │     ├── if (isLastMember):
  │     │     → deleteWorkspaceCompletely(workspaceId, session)
  │     │   else:
  │     │     → deleteOne caller's WorkspaceMember row
  │     └── resetActiveWorkspaceIfMatches:
  │           if (user.activeWorkspaceId === workspaceId)
  │             → updateActiveWorkspace(user, personalWorkspaceId, session)
  ├── commitTransaction()
  └── return { deleted: isLastMember }
```

Client uses `result.deleted` to pick the success toast: `success` ("You left.") vs. `successDeleted` ("You left and the household was deleted.").

---

## Remove member flow

```
DELETE /api/workspaces/:id/members/:userId   (authed, owner-only)
  ↓
sharedWorkspaceService.removeMember(callerUserId, workspaceId, targetUserId)
  ├── reject if invalid ObjectId, self-remove, or workspace.type === 'personal'
  ├── assert caller is workspace owner
  ├── assert target is a member
  ├── load target user (for email)
  ├── startSession() + startTransaction()
  ├── removeMemberFromWorkspaceTx(workspaceId, targetUserId, session):
  │     ├── deleteOne target's WorkspaceMember row
  │     └── resetActiveWorkspaceIfMatches(targetUserId, workspaceId, session)
  ├── commitTransaction()
  ├── // post-commit (best-effort, not in transaction):
  │   void sendWorkspaceRemovalNotification({ to, workspaceName })
  └── return { ok: true }
```

The target's transactions/categories/payment-methods/budgets/goals **stay in the workspace**. They retain their original `userId`, which the attribution service resolves to `__anonymous__` for display when the user is no longer a member.

---

## Invitation lifecycle

```
state machine (all guards in sharedWorkspaceService):

(no row)
  │   POST /api/workspaces/:id/invitations
  │   guards: SELF_INVITE, ALREADY_MEMBER, ALREADY_INVITED, MEMBER_CAP_REACHED
  ▼
pending  ──── expiresAt < now() ────▶  pending (effective: expired)
  │                                       (no DB write; effectiveStatus() computes it)
  │
  ├── POST /api/invitations/:token/accept (authed, email-matched, not expired)
  │   guards: INVITATION_NOT_FOUND/NOT_PENDING/EXPIRED, EMAIL_MISMATCH,
  │           MEMBER_CAP_REACHED, WORKSPACE_CAP_REACHED
  │   → inserts WorkspaceMember, sets status='accepted', acceptedByUserId
  ▼
accepted (terminal)

  ├── POST /api/invitations/:token/decline (authed)
  │   → status='declined'
  ▼
declined (terminal)

  ├── DELETE /api/workspaces/:id/invitations/:invId (owner-only)
  │   → status='revoked'
  ▼
revoked (terminal)
```

**Lazy expiration.** No cron job. The DB row's `status` stays `'pending'` past `expiresAt` forever. `isExpired(invitation)` is computed at read time and gates every consumer:
- `findPendingInvitations` filters out expired ones from the owner's pending list.
- `requireActionableInvitation` (accept + decline) throws `INVITATION_EXPIRED`.
- `createInvitation`'s `ALREADY_INVITED` guard checks `existingPending && !isExpired(existingPending)` — an expired pending row doesn't block re-invite.

**Member-cap counts pending too.** When the invite-create guard checks `memberCount + pendingCount >= MAX_WORKSPACE_MEMBERS`, the pending count includes only non-expired pending invitations. You can't "stack" pending invitations to bypass the 2-person ceiling.

---

## User account deletion

This is the operation that previously had the cross-workspace bug (deleted by `{userId}` across every scoped collection). The current shape:

```
userService.deleteUserCompletely(userId, feedback?)
  ├── load user (need .name for analytics anonymization later)
  ├── snapshot user for post-commit analytics
  ├── recordDeletionFeedback(user, feedback)  // best-effort, separate write
  ├── startSession() + startTransaction()
  ├── for each WorkspaceMember of this user:
  │     load the workspace
  │     ├── if workspace.type === 'personal':
  │     │     → deleteWorkspaceCompletely(workspace._id, session)
  │     └── else (shared):
  │           → leaveSharedWorkspaceTx(userId, workspace._id, session)
  │             // handles transfer-of-ownership AND last-member-cascade
  ├── // user-level anonymizations (still in session):
  │   deleteDebugSnapshots({ userId }, session)
  │   anonymizeByUser  on user_activity_events
  │   anonymizeByUserName on analytics_events
  │   anonymizeByUser on daily_activities
  │   anonymizeByUser on feedbacks
  ├── deleteUserById(userId, session)
  ├── commitTransaction()
  └── // post-commit best-effort:
      trackWithSnapshot('user_deleted', snapshot)
```

**Critical invariant.** Workspace-scoped data (transactions, accounts, categories, etc.) is only ever deleted by **destroying the whole workspace**. A `deleteMany({ userId })` across scoped collections would orphan partners' data and is the bug we explicitly closed.

---

## Anonymization (creator attribution after leave/remove)

When a member leaves or is removed, their `userId` stays stamped on the rows they created. The display layer translates that to `__anonymous__` via `attributionService`:

```ts
resolveCreatorName(creatorUserId, workspaceId):
  member = workspaceMemberRepository.findOne(workspaceId, creatorUserId)
  if (!member) return ANONYMOUS_SENTINEL  // '__anonymous__'
  user = userRepository.findById(creatorUserId)
  return user?.name ?? ANONYMOUS_SENTINEL
```

The sentinel is wire-format. The client i18n's it to "אנונימי" / "Anonymous" at render time. Workspace export's `createdBy` field uses the same resolution.

---

## Data export

Two endpoints, one rule: **every export contains data from exactly ONE workspace.**

| Endpoint | Auth | Scope | Use case |
|---|---|---|---|
| `GET /api/users/me/export` | authed user | the user's currently active workspace | settings → "Download data" when in single-workspace mode |
| `GET /api/workspaces/:id/export` | authed user, asserts membership | the workspace in the path | leave dialog "download before leaving"; multi-workspace export picker |

Both use the same shape of output: a JSON object with the workspace's accounts, categories, payment methods, transactions, recurring templates, budgets, goals. The workspace-level export adds a top-level `workspace` block and replaces each row's `userId` with a `createdBy` field (the attribution result).

**Multi-workspace export picker** (settings → Download for users in ≥2 workspaces): lists each workspace + an "All" option. "All" triggers `downloadWorkspaceData(id)` sequentially with a 400 ms delay between to avoid the browser's rapid-download block. Each workspace is its own JSON file — **never merged**.

**Content-Disposition** uses RFC 5987 (`filename*=UTF-8''<percent-encoded>`) so Hebrew workspace names come through. ASCII fallback (`filename="lyra-workspace-2026-05-30.json"`) for older browsers. **CORS must expose `Content-Disposition`** (set in `server/src/config/security.ts`) — without it, axios can't read the header and downloads get the client-side fallback name.

---

## Workspace-scoped uniqueness (the unique-index gotcha)

Pre-Shared-Workspaces, three collections had `userId`-scoped unique indexes:
- `categories`: `{ name, userId, type }` unique.
- `payment_methods`: `{ name, type, userId }` unique sparse.
- `accounts`: `{ userId }` unique partial where `isPrimary: true`.

These broke as soon as a user tried to create a **second** workspace with the same default categories — E11000 duplicate key from inserting the second `אוכל / Expense` for the same userId.

Fix is in the model code (workspaceId-scoped replacements) **and** required manual one-time index drops in MongoDB. Mongoose's `autoIndex` adds new indexes but doesn't remove old ones; both coexist and the legacy one keeps firing until dropped:

```js
// run once per database (lyra_staging, then lyra)
db.categories.dropIndex("name_1_userId_1_type_1")
db.payment_methods.dropIndex("name_1_type_1_userId_1")
db.accounts.dropIndex("userId_1")
```

After dropping, restart the server and mongoose creates the new workspace-scoped versions automatically.

---

## Client patterns to know

### Stale workspace-scoped IDs in React state

Switching workspace invalidates every TanStack Query, but **local React state** holding entity IDs (selected accountId, selected categoryIds, etc.) doesn't auto-clear. We have explicit cleanup in:

- [`pages/Overview/OverviewFiltersProvider.tsx`](../client/src/pages/Overview/OverviewFiltersProvider.tsx): `useEffect` watches the accounts list; if the stored `accountId` isn't in it, resets to the new primary.
- [`pages/Transactions/TransactionPageDataProvider.tsx`](../client/src/pages/Transactions/TransactionPageDataProvider.tsx): three `useEffect`s watch categories/accounts/payment-methods; filter out any selected IDs no longer in the current workspace's entity list.

Any future filter/selector that stores a workspace-scoped ID in local state must do the same.

### Modal conventions

`LyraDialog` has a `forceDialog` prop:
- **Content panels** (Settings, Create/Edit forms) → default: responsive container (centered dialog on desktop, bottom sheet on mobile).
- **Confirmations** (Leave, Remove, all Delete*, UserDeletion, ExportPicker) → `forceDialog={true}` → centered modal on every breakpoint. Prevents stacked-sheet-on-sheet on mobile when the confirmation opens from inside another bottom sheet.

Mobile bottom-sheet action button rows are auto-styled into a full-width split row via CSS injected into the Drawer's `Paper` sx — no per-dialog edit needed. The "primary" button (any `variant="contained"` with `color` primary/error/secondary) gets `flex: 2`, secondaries get `flex: 1`.

---

## See also

- Domain doc: [`LyraVault/domains/workspaces.md`](../../LyraVault/domains/workspaces.md)
- Bug history: search `LyraVault/bugs-fixed.md` for "workspace" entries
- CLAUDE.md → Modals & confirmations
- CLAUDE.md → Architecture Rules (Controllers → Services → Repositories)
