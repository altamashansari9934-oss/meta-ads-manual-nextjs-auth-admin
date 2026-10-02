# Design Restore

Changed only the manual presentation binding:

- Restored legacy `#macd-app` CSS scope around rendered content.
- Restored legacy mode IDs (`macd-mode-lead`, `macd-mode-budget`, etc.).
- Restored legacy panel IDs (`macd-panel-testing`, `macd-audience-panel-full`, etc.).
- Added compatibility overrides so old root-layout rules cannot break the new React sidebar/topbar.
- React navigation/state logic is unchanged.
- Auth/Admin/Supabase logic is unchanged.
- Manual panel HTML/content is unchanged.
