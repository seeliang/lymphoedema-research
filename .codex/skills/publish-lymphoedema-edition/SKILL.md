---
name: publish-lymphoedema-edition
description: Publish or correct an immutable bilingual Lymphoedema Research Brief edition and verify that the requested content hierarchy is visible in the built and live public pages. Use for new editions, patch editions, publication requests, corrections to what appears first, child-focus changes, deferred-evidence changes, translations, release tags, or when source or scanner changes did not appear on the website.
---

# Publish Lymphoedema Edition

Publish the requested patient-facing outcome, not merely an internal data change. A research scan, issue, source snapshot, or change note does not satisfy a request about what readers see.

## 1. Choose the release type

Compare the approved edition record with the intended public page before assigning a new version.

- Use the existing edition number for a renderer, navigation, styling, accessibility, caching, or deployment defect when the approved edition data, evidence wording, review date, sources, and translation record are unchanged.
- Create a new research patch edition when evidence selection, interpretation, reviewed patient-facing wording, source links, trials, or research data change.
- Use `translationRevision` rather than a research edition when only translated wording changes.

Do not copy evidence into a new edition merely because the website failed to display already-approved content. Keep the existing research tag in place for a presentation-only repair; never move or recreate it at the deployment-fix commit.

## 2. Write the public outcome contract

Before editing, turn the request into observable assertions. Record:

- edition number and immutable URL;
- English and Chinese section headings and order;
- which section is the main focus and which material is secondary;
- the first and last visible evidence cards when ordering matters;
- whether deferred candidates are visible and explicitly excluded from reviewed findings;
- translation status and indexing requirement.

If the user says children are the main section, require the built page to place a visible children section before adult evidence. Do not interpret a scanner-only children section as completion.

## 3. Preserve released research content

Never rewrite evidence files for an already published edition. For a research-content correction, create the next patch edition, copy unchanged reviewed evidence into its own directory, mark the previous edition superseded, and add a correction notice when the old public page was misleading.

For a presentation-only repair, change the renderer or deployment layer under the existing edition number. Leave edition data and evidence files untouched, retain an auditable commit, and add a service or correction notice only when the display defect may have misled readers.

Keep unreviewed discovery candidates separate from patient-facing findings. A candidate may be shown as pending or deferred only when its status, reason, and revisit trigger are explicit. Do not write a clinical takeaway until source review is complete.

## 4. Keep both languages structurally identical

The English edition is the evidence record. Translate the same sections, counts, evidence IDs, trial IDs, limitations, sources, and deferred IDs into Simplified Chinese. Follow `$translate-lymphoedema-zh` for wording and parity. Keep an AI-assisted Chinese edition visibly labelled and `noindex` until independent human language review.

## 5. Verify rendered output

Run the full build and edition checks:

```sh
pnpm check
pnpm release:check -- YYYY.MM.PATCH
pnpm check:publication -- YYYY.MM.PATCH
```

The publication-contract check must read `dist/versions/<version>/index.html`, `dist/zh-cn/versions/<version>/index.html`, and both `edition.json` artifacts. It must fail when the requested hierarchy, headings, evidence order, counts, deferred separation, translation status, or Chinese `noindex` metadata is absent.

Also inspect the generated pages directly. Source JSON passing is insufficient.

## 6. Publish and verify the exact commit

For a new research edition, stage only the edition slice, commit it, push the working branch, fast-forward `main`, and create `research-<version>` at the exact published commit. Do not retag an old commit.

For a presentation-only repair, stage only the renderer, test, and policy slice; commit and deploy it without changing the edition number or research tag.

Wait for Pages deployment, then inspect the live English and Chinese root pages and immutable version URLs. Verify the same outcome contract against live HTML. For a new edition, confirm the old edition shows its correction notice and the research tag points to the edition commit. For a presentation-only repair, confirm the live pages use the unchanged edition number and the existing research tag was not moved. If optional release tooling requires login, report that separately; it does not replace verification of the public site.
