# ADR 005 — Admin Approval Flow

**Date:** 2026-05-29  
**Status:** Accepted

## Context

We needed to decide how new users gain access to the application after signing up.

## Options Considered

| Option | Security | UX | Complexity |
|---|---|---|---|
| Open registration (anyone can log in after email verify) | Low | Best | Low |
| Auto-approve after email verify | Medium | Good | Low |
| Admin manually approves every user | High | Slower | Medium |

## Decision

**Admin must explicitly approve each user** and assign an access level before they can log in.

## Rationale

- The application is intended for a controlled user base, not public self-registration
- Admin assigns `edit` or `view` access at approval time — this drives feature gating in future phases
- Prevents unauthorized access even if the signup URL is discovered

## User Status State Machine

```
pending_email ──(click email link)──► pending_approval ──(admin approves)──► active
                                                         ──(admin rejects)──► rejected
```

## Implementation

- Status stored on the `User` document in MongoDB
- Login is blocked with a specific message for `pending_email` and `pending_approval` statuses
- Admin dashboard (`/admin`) shows all non-admin users with current status
- Approve action requires selecting `edit` or `view` access before confirming
- `PUT /api/admin/users/:id/approve` accepts `{ access: 'edit' | 'view' }`
- `PUT /api/admin/users/:id/reject` sets status to `rejected`

## Consequences

- First admin must be created via `npm run seed:admin` — there is no admin signup flow
- If admin is unavailable, users are stuck in `pending_approval`; Phase 2 may add email notification to admin
- Rejected users see an error message on login; no self-service appeal flow in Phase 1
