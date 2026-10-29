# Shared SEO Action Tracker (/seo-tracker/)

Standalone page for Rob, Steve, Randy and the team. No links into the private hub.

- Data: `seo-tracker/tracker.json` (single source, one entry per tracker item #1-#36).
- Update: edit an item's `parties` (rob/randy/steve/dev: done|open|waiting|na), `light` (green|yellow|red), `status`, `waitingOn`, `nextStep` (5-8 plain words), `verified` ("YYYY-MM-DD: what was checked live"), `links.wordDoc` (SharePoint folder or per-item Word doc), `links.legacyVercelRevisions`, then bump `updated`, validate (`python3 -m json.tool seo-tracker/tracker.json`), commit and push main.
- `sheetDiff` flags where Steve's spreadsheet status differs from the verified status. Keep only shareable text here (no internal notes).
- Person views: `/seo-tracker/#randy`, `#steve`, `#rob`, `#dev` (items where that person has a part).

- Last updated box (top right): edit top-level `lastUpdated` and `updateNote` in tracker.json.

- Updates log: each item has `updates` (newest first): `{date, time, text, verified}`. Running updates go here, not in new Word doc versions. SharePoint keeps one Word doc per item for notes; do not re-upload versions.

- Send an update form (top of page): posts to FormSubmit (endpoint id in index.html, activated to bdub@mail.grokbot.com, cc rhalik@tellennium.com). Submissions never edit the tracker; the B Dub inbox is the review queue. Rob or B Dub approves an update by adding it to that item's `updates` in tracker.json.
- Form fallback (10/29): if FormSubmit cannot send (outage, network, non-2xx), the form says the update was not sent and shows a prefilled email link To rhalik@tellennium.com, CC bdub@mail.grokbot.com, with the same subject 'SEO tracker update: #N from NAME'. Same fallback on the QBR answers app (subject 'QBR answer: REF from NAME').
