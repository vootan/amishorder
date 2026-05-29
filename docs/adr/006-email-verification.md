# ADR 006 — Email Verification Before Admin Review

**Date:** 2026-05-29  
**Status:** Accepted

## Context

We needed to decide whether to verify a user's email address before or after admin approval, or skip it entirely.

## Decision

**Verify email first, then require admin approval.**

Order: `signup → email verify → admin approval → active`

## Rationale

- Confirms the user owns the email address before an admin spends time reviewing
- Prevents admins from approving accounts with typo'd or fake email addresses
- The verification token expires in 24 hours — prevents stale unverified accounts accumulating

## Implementation

- On signup: a cryptographically random 32-byte hex token is generated (`crypto.randomBytes(32)`)
- Token + expiry stored on the `User` document (`emailVerificationToken`, `emailVerificationExpires`)
- Email sent via Nodemailer with a link to `SERVER_URL/api/auth/verify-email/:token`
- The **server endpoint** validates the token, updates status to `pending_approval`, then **redirects** the browser to `CLIENT_URL/verify-email?success=true`
- The React `VerifyEmailPage` reads `?success=true` or `?error=...` from the query string — it does not call the API directly

> **Important:** The email link must point to the SERVER, not the React app. The server does the DB lookup and redirects. The React page only reads the result.

## Gmail SMTP Notes

- Gmail requires an **App Password** — regular account passwords are rejected since 2022
- Generate at: myaccount.google.com → Security → App passwords
- `SMTP_FROM` value in `.env` must be quoted: `"App Name <email@gmail.com>"`
- Port 587 with `secure: false` (STARTTLS) is the correct Gmail config

## Consequences

- Users who lose the verification email must re-register (no resend flow in Phase 1)
- Token expiry (24h) is hardcoded in `auth.service.ts` — make configurable in Phase 2 if needed
- Email sending failures throw an error and prevent signup completion — the user is notified
