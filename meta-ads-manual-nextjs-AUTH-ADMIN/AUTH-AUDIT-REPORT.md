# Authentication Audit Report

## Scope audited

Existing Next.js App Router + Supabase project only. Manual content, manual UI, manual CSS, and the existing admin/user-access model were preserved.

## Findings before changes

1. `lib/supabase/server.ts` used `NEXT_PUBLIC_SUPABASE_ANON_KEY` while the intended deployment uses the modern publishable key.
2. No browser Supabase client existed under `lib/supabase/client.ts`.
3. No `middleware.ts` or `proxy.ts` existed, so cookie-backed Supabase sessions did not have a request-level refresh mechanism.
4. `AccessHeartbeat` was only an access-status poller; it was not a Supabase auth-session refresh mechanism.
5. Forgot-password emails redirected directly to `/update-password`; there was no SSR callback/code exchange route establishing a recovery session first.
6. `/update-password` did not verify that the request came from an authenticated recovery session.
7. Login/signup exposed raw Supabase `error.message` text to the UI in some cases.
8. Admin actions were server protected by `requireAdmin()`, but a crafted server-action request could target an admin profile even though the UI labels admin rows as protected.
9. Existing `/manual` protection is server-side and was already sound: it calls `requireApprovedUser()` before returning manual content.
10. Existing RLS already prevents normal users from updating their own profile/access fields; no database-schema replacement is required.
11. Existing verified-user trigger creates `profiles` only after `email_confirmed_at` is present; this behavior was preserved.

## Changes made

- Standardized Supabase public credentials to:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Added `lib/supabase/client.ts` for browser client separation.
- Kept `lib/supabase/server.ts` as the server client and switched it to the publishable key.
- Added `lib/supabase/proxy.ts` plus root `proxy.ts` for Next.js 16 session refresh.
- Proxy validates/refreshes with `supabase.auth.getClaims()` and propagates refreshed cookies.
- Added `/auth/callback` for PKCE code exchange and token-hash verification.
- Signup now sends verification back through `/auth/callback?flow=signup`.
- Password reset now sends recovery back through `/auth/callback?flow=recovery`.
- `/update-password` now requires an authenticated recovery session plus a short-lived HttpOnly recovery marker.
- Successful password change signs the recovery session out and redirects to `/login`.
- Added friendly auth error mapping without exposing raw backend errors.
- Hardened admin mutation actions so normal-user actions cannot be applied to rows with `role='admin'` even via crafted form submissions.
- Added production/local URL helper via `NEXT_PUBLIC_SITE_URL`.
- Updated `.env.example` and `AUTH-SETUP.md`.
- Updated Supabase auth dependencies to current compatible versions used by the current SSR guidance.

## Existing access rules preserved

- pending
- approved
- revoked
- blocked
- expired access
- 30 days
- 90 days
- 1 year
- permanent
- approve/update access
- revoke
- block
- restore
- admin server-side authorization

## Database / SQL

No SQL change is required for this auth fix. The existing schema/RLS already provides the required normal-user restrictions and verified-profile creation.

## Required Supabase settings

Authentication -> URL Configuration

Site URL:

`https://meta-ads-manual-nextjs-auth-admin.vercel.app`

Redirect URLs:

- `https://meta-ads-manual-nextjs-auth-admin.vercel.app/auth/callback`
- `http://localhost:3000/auth/callback`

Keep Email provider enabled and **Confirm email enabled**.

## Required Vercel environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL=https://meta-ads-manual-nextjs-auth-admin.vercel.app`

Vercel Root Directory should remain:

`meta-ads-manual-nextjs-AUTH-ADMIN`

## Recommended email-template links

The callback supports both PKCE auth-code exchange and token-hash verification. For robust SSR email links, Supabase templates may use:

Confirm signup:

`{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email`

Reset password:

`{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery`

## Validation performed in this environment

- All TS/TSX files were syntax-transpiled: PASS (29 files, 0 syntax errors).
- Manual `components/ManualApp.tsx`: byte-for-byte unchanged.
- Manual `content/panels/*`: byte-for-byte unchanged.
- Manual `app/manual.css`: byte-for-byte unchanged.
- Manual `app/manual/page.tsx`: byte-for-byte unchanged.
- No `NEXT_PUBLIC_SUPABASE_ANON_KEY` references remain.
- No Supabase service-role/secret key references are present.
- Required SSR files exist (`client.ts`, `server.ts`, proxy utility, root `proxy.ts`, auth callback).

## Build limitation

A full `npm install` / `next build` could not be completed in the execution environment because outbound package installation timed out and `node_modules` is not available here. Therefore this package is **not being claimed as production-build-verified**. Run `npm install && npm run build` locally or let Vercel perform a clean production build after setting the environment variables above. Do not use Vercel's old build cache for the first deployment of these auth changes.
