# Editorial drafts

This directory is a staging area for human or AI-assisted research proposals. Nothing here is loaded by the public site or constitutes a reviewed edition.

Create one folder per review month, for example `drafts/2026-09/`. A proposal should contain:

- `TRIAGE.md` with every candidate considered, the include/exclude decision, and the reason;
- one Markdown file per proposed evidence item, using the published evidence fields where they are known;
- an explicit `bodyAreas` label when a request or finding is location-specific;
- direct source links and identifiers;
- explicit notes for any claim that still needs full-text verification; and
- no copied abstracts, personal medical information, review dates, or claim of editorial approval.

After a human editor checks every changed statement against its source, approved wording is manually promoted into a new version under `src/data/evidence/` and `src/data/editions.json`. The draft remains in version control as an audit trail or is closed with a documented exclusion decision.
