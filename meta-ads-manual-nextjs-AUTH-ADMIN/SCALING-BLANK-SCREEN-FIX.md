# Scaling Blank Screen Fix

Cause:
The Scaling Framework mode existed in the HTML, but it was inserted after the closing `.macd-shell` div.
The navigation could activate it, but it was outside the main application workspace, causing the blank content area.

Fixed:
- Scaling Framework moved inside `.macd-shell`
- Sections 01–19 preserved in Scaling Framework tab
- Sections 20–22 preserved in Quick Decision tab
- No accordion added
- Existing Audience / Lead / E-commerce preserved
- Auth/Admin preserved
