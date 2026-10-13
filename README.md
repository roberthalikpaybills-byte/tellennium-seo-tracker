# Shared SEO Action Tracker (/seo-tracker/)

Standalone page for Rob, Steve, Randy and the team. No links into the private hub.

- Data: `seo-tracker/tracker.json` (single source, one entry per tracker item #1-#36).
- Update: edit an item's `parties` (rob/randy/steve/dev: done|open|waiting|na), `light` (green|yellow|red), `status`, `waitingOn`, `nextStep` (5-8 plain words), `verified` ("YYYY-MM-DD: what was checked live"), `links.wordDoc` (SharePoint folder or per-item Word doc), `links.legacyVercelRevisions`, then bump `updated`, validate (`python3 -m json.tool seo-tracker/tracker.json`), commit and push main.
- `sheetDiff` flags where Steve's spreadsheet status differs from the verified status. Keep only shareable text here (no internal notes).
- Person views: `/seo-tracker/#randy`, `#steve`, `#rob`, `#dev` (items where that person has a part).

- Last updated box (top right): edit top-level `lastUpdated` and `updateNote` in tracker.json.

- Updates log: each item has `updates` (newest first): `{date, time, text, verified}`. Running updates go here, not in new Word doc versions. SharePoint keeps one Word doc per item for notes; do not re-upload versions.
