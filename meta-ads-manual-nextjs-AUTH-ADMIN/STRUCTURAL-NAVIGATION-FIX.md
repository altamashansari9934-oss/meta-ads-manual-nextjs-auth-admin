# Structural Navigation Fix

Root causes fixed:

1. Budget Allocation was outside `.macd-shell`.
   It is now a direct child of the same shell as Audience, Lead, E-commerce and Scaling.

2. `syncAppNavigation()` referenced undefined variable `activePanel`.
   This caused a runtime JavaScript error and stopped sidebar/breadcrumb synchronization.

3. Sidebar navigation used a deferred click sequence.
   It now activates mode and sub-tab deterministically and synchronizes immediately.

4. Scaling / Budget sub-tabs use a clean shared `activateExtraTab()` implementation.

Verified:
- All 5 mode panels are direct children of `.macd-shell`
- Budget sections 01-34 present
- Scaling sections 01-22 present
- No duplicate IDs
- JavaScript syntax PASS
