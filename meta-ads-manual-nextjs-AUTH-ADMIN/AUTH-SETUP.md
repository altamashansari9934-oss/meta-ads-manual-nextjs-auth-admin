# Supabase Auth + Admin Access Setup

This project uses Supabase SSR with cookie-based sessions, server-side access checks, verified-email profiles, and admin-controlled access.

## Environment variables

Local `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Vercel Production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
NEXT_PUBLIC_SITE_URL=https://meta-ads-manual-nextjs-auth-admin.vercel.app
```

No Supabase secret/service-role key is required by this application.

## Supabase Authentication -> URL Configuration

Set Site URL:

```text
https://meta-ads-manual-nextjs-auth-admin.vercel.app
```

Add Redirect URLs:

```text
https://meta-ads-manual-nextjs-auth-admin.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

For Vercel preview deployments, add an appropriate preview wildcard only if you intentionally test auth on previews.

## Email provider

Keep Email provider enabled and keep **Confirm email** enabled.

Signup flow:

`/signup -> verification email -> /auth/callback?flow=signup -> /login -> profile/access check`

Only verified users receive a `public.profiles` row through the existing database trigger in `supabase/schema.sql`.

## Password reset

Flow:

`/forgot-password -> reset email -> /auth/callback?flow=recovery -> /update-password -> /login`

The callback exchanges the PKCE auth code for a cookie-backed recovery session. `/update-password` requires both the authenticated recovery session and a short-lived HttpOnly recovery marker.

## Database / RLS

Use the existing `supabase/schema.sql`. The existing policies preserve:

- user reads own profile
- admin reads all profiles
- admin updates access records
- normal users cannot update their own role/access status/expiry

No service-role key is used by the browser.

## Admin creation

After your own account is email-verified and its profile exists, run once in Supabase SQL Editor:

```sql
update public.profiles
set role = 'admin',
    access_status = 'approved',
    access_expires_at = null,
    approved_at = now()
where email = 'YOUR_ADMIN_EMAIL@example.com';
```

## Existing access states preserved

- pending
- approved
- revoked
- blocked
- expired
- 30 days
- 90 days
- 1 year
- permanent
- approve/update
- revoke
- block
- restore

`/manual` remains protected server-side by `requireApprovedUser()`.
`/admin/users` and all admin mutation actions remain protected server-side by `requireAdmin()`.

`AccessHeartbeat` remains only for periodic access-status checking while the manual is already open. It is not the auth session refresh mechanism; `proxy.ts` refreshes the Supabase SSR session.

## Recommended SSR email-template links (optional but more robust)

The callback supports both PKCE `code` exchange and `token_hash` verification. The default Supabase templates can work with the callback redirect, but for a server-side flow that does not depend on the same browser retaining the PKCE verifier, you can customize the email links to use `TokenHash`.

Confirm signup link example:

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">Confirm email address</a>
```

Reset password link example:

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">Reset password</a>
```

Because the application passes `/auth/callback?flow=signup` or `/auth/callback?flow=recovery` as `RedirectTo`, these links work with both the configured local URL and production URL, provided both callback URLs are allow-listed in Supabase.
