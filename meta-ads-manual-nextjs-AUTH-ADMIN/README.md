# Meta Ads Creative Field Manual — Next.js + Supabase Access Control

This project includes:

- Next.js
- React
- TypeScript
- Supabase email/password authentication
- FINAL corrected Audience & Creative Strategy module
- Data Interpretation removed
- Admin approval before manual access
- Revoke / Block / Restore access
- 30-day / 90-day / 1-year / permanent access
- Server-side protected `/manual`
- Admin user management at `/admin/users`
- Mobile-optimized Meta Ads manual

## Run locally

1. Copy `.env.example` to `.env.local`
2. Add Supabase values
3. Run `supabase/schema.sql` in Supabase SQL Editor
4. Install and start:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Detailed setup:

`AUTH-SETUP.md`

## Main URLs

- `/signup`
- `/login`
- `/manual`
- `/admin/users`
