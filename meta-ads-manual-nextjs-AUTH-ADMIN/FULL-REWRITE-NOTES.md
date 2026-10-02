# Full Rewrite
Manual UI/navigation rewritten from scratch with React state.

Removed:
- iframe manual rendering
- legacy manual navigation JavaScript
- MutationObserver navigation syncing
- duplicate event controllers
- DOM show/hide race conditions

New:
- one React state controls top navigation
- same state controls left sidebar
- same state controls subtabs
- Budget and Scaling content are ordinary React-rendered panels

Preserved:
- all extracted Audience / Lead / E-commerce / Scaling / Budget content
- Auth/Admin
- email verification
- forgot password
- approval/revoke/block/expiry
