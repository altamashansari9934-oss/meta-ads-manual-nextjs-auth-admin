# Build Fix

Root cause:
The previous design-restore patch appended CSS with literal escaped newline sequences (`\n`)
instead of real line breaks. Next.js/Turbopack CSS parsing can fail on that malformed CSS.

Fixed:
- Converted all literal `\n` sequences in `app/manual.css` to actual new lines.
- Preserved React navigation.
- Preserved manual content.
- Preserved auth/admin/access logic.
- Preserved design compatibility selectors.

Literal escaped newlines fixed: 61
Remaining: 0
CSS brace balance: PASS
ManualApp TypeScript syntax: PASS
