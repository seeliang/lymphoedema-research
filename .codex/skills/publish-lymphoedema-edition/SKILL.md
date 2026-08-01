---
name: publish-lymphoedema-edition
description: Publish or correct an immutable bilingual Lymphoedema Research Brief edition and verify that the requested content hierarchy is visible in the built and live public pages. Use for new editions, patch editions, publication requests, corrections to what appears first, child-focus changes, deferred-evidence changes, translations, release tags, or when source or scanner changes did not appear on the website.
---

# Publish Lymphoedema Edition

Publish the requested patient-facing outcome, not merely an internal data change. A research scan, issue, source snapshot, or change note does not satisfy a request about what readers see.

## 1. Write the public outcome contract

Before editing, turn the request into observable assertions. Record:

- edition number and immutable URL;
- English and Chinese section headings and order;
- which section is the main focus and which material is secondary;
- the first and last visible evidence cards when ordering matters;
- whether deferred candidates are visible and explicitly excluded from reviewed findings;
- translation status and indexing requirement.

If the user says children are the main section, require the built page to place a visible children section before adult evidence. Do not interpret a scanner-only children section as completion.

## 2. Preserve released editions

Never rewrite evidence files for an already published edition. Create the next patch edition, copy unchanged reviewed evidence into its own directory, mark the previous edition superseded, and add a correction notice when the old public page was misleading.

Keep unreviewed discovery candidates separate from patient-facing findings. A candidate may be shown as pending or deferred only when its status, reason, and revisit trigger are explicit. Do not write a clinical takeaway until source review is complete.

## 3. Keep both languages structurally identical

The English edition is the evidence record. Translate the same sections, counts, evidence IDs, trial IDs, limitations, sources, and deferred IDs into Simplified Chinese. Follow `$translate-lymphoedema-zh` for wording and parity. Keep an AI-assisted Chinese edition visibly labelled and `noindex` until independent human language review.

## 4. Verify rendered output

Run the full build and edition checks:

```sh
pnpm check
pnpm release:check -- YYYY.MM.PATCH
pnpm check:publication -- YYYY.MM.PATCH
```

The publication-contract check must read `dist/versions/<version>/index.html`, `dist/zh-cn/versions/<version>/index.html`, and both `edition.json` artifacts. It must fail when the requested hierarchy, headings, evidence order, counts, deferred separation, translation status, or Chinese `noindex` metadata is absent.

Also inspect the generated pages directly. Source JSON passing is insufficient.

## 5. Publish and verify the exact commit

Stage only the edition slice, commit it, push the working branch, fast-forward `main`, and create `research-<version>` at the exact published commit. Do not retag an old commit.

Wait for Pages deployment, then inspect the live English and Chinese root pages and immutable version URLs. Verify the same outcome contract against live HTML, confirm the old edition shows its correction notice, and confirm `main`, the tag, and the deployed edition identify the same version. If optional release tooling requires login, report that separately; it does not replace verification of the public site.
