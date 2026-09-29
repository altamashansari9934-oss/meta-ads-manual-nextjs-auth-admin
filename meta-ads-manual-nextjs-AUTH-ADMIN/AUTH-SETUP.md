# Login + Admin Approval Setup

The code is complete, but it needs a Supabase project because login/password and user access status need a database.

## 1. Create Supabase project

Create a project at Supabase.

In Supabase:

- Project Settings
- API

Copy:

- Project URL
- anon / public key

## 2. Add environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

On Vercel, add the same values under:

`Project -> Settings -> Environment Variables`

Then redeploy.

## 3. Create database structure

Open:

`Supabase -> SQL Editor`

Run the complete file:

`supabase/schema.sql`

## 4. Create your own admin account

Open your deployed website:

`/signup`

Create your account.

Then in Supabase SQL Editor run:

```sql
update public.profiles
set role = 'admin',
    access_status = 'approved',
    access_expires_at = null,
    approved_at = now()
where email = 'YOUR_EMAIL_HERE';
```

Replace `YOUR_EMAIL_HERE` with your actual login email.

Sign out and sign in again.

## 5. WHERE YOU CONTROL USERS

Your admin panel URL is:

```text
https://YOUR-DOMAIN.com/admin/users
```

For example:

```text
https://meta-ads-manual.vercel.app/admin/users
```

Only a profile with `role = admin` can open this page.

## Admin panel controls

For every normal user you can:

- Approve for 30 days
- Approve for 90 days
- Approve for 1 year
- Approve permanently
- Update expiry
- Revoke access
- Block access
- Restore access

## User URLs

Login:

```text
/login
```

Signup:

```text
/signup
```

Protected manual:

```text
/manual
```

Pending approval:

```text
/pending
```

Revoked:

```text
/revoked
```

Blocked:

```text
/blocked
```

Expired:

```text
/expired
```

## Security behavior

The manual HTML is stored under the app's server-side `content/` folder, not `public/`.

The `/manual` page checks the authenticated user and profile access status **before** reading and returning the manual.

This means an unapproved visitor cannot simply open `/manual` or a public HTML-file URL.

The manual page also performs a lightweight access check every 30 seconds. If an admin revokes or blocks the account while the manual is open, the user is redirected away on the next check.

Important: content that a user has already viewed cannot be technologically "unseen", but future access and the open session page are cut off by the access checks.

## Email verification

Supabase may require email confirmation by default.

You can either:

- keep email confirmation enabled (recommended for production), or
- change the setting during testing in Supabase Auth settings.
